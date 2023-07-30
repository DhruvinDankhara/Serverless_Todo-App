require("dotenv").config();
const express = require("express");
const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const { createToken } = require("./jwtConfig");
const cors = require("cors");
const dynamoDB = require("./db");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const todosTableName = "Todos";
const usersTableName = "Users";

dynamoDB.scan(
    {
        TableName: todosTableName, // Replace with the name of an existing DynamoDB table
    },
    (err, data) => {
        if (err) {
            console.error("Error connecting to DynamoDB:", err);
        } else {
            console.log("Connected to DynamoDB!");
        }
    }
);

// CRUD APIs

app.use("/health-check", async (req, res, next) => {
    console.log();
    res.status(httpStatus.OK).json({
        status: true,
        message: "Server is online",
    });
});

app.post("/sign-up", async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        // Check if the user already exists
        const userExists = await getUserByEmail(email);
        if (userExists) {
            return res
                .status(409)
                .json({ error: "User with this email already exists" });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        const params = {
            TableName: usersTableName,
            Item: {
                userId: uuidv4(),
                email,
                password: hashedPassword,
                firstName,
                lastName,
            },
        };

        const data = await dynamoDB.put(params).promise();
        console.log(data);
        res.status(httpStatus.OK).json({
            status: true,
            message: "user created successfully",
        });
    } catch (err) {
        console.error("Error signing up:", err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            error: "Failed to sign up",
        });
    }
});

// Login API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Retrieve the user from the database based on the email
        const user = await getUserByEmail(email);

        if (!user) {
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json({ error: "Invalid credentials" });
        }

        // Compare the provided password with the hashed password from the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json({ error: "Invalid credentials" });
        }
        const token = await createToken(user);

        res.status(httpStatus.OK).json({
            status: true,
            message: "login successfull",
            data: {
                ...user,
                password: "",
            },
            token: token,
        });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            error: "Failed to log in",
        });
    }
});

// Helper function to retrieve a user by email
const getUserByEmail = async (email) => {
    const params = {
        TableName: usersTableName,
        Key: {
            email: email,
        },
    };

    const data = await dynamoDB.get(params).promise();
    return data.Item;
};
const getTodosByUserId = async (userId) => {
    const params = {
        TableName: todosTableName,
        FilterExpression: "userId = :idValue",
        ExpressionAttributeValues: {
            ":idValue": userId,
        },
        ScanIndexForward: true,
    };

    const data = await dynamoDB.scan(params).promise();
    data.Items.sort((a, b) => b.createdAt.localeCompare(b.createdAt));
    console.log(data);
    return data.Items;
};

// Create a new todo
app.post("/create-todo", async (req, res) => {
    const { task, userId, status = "PENDING" } = req.body;
    const id = uuidv4();

    try {
        const params = {
            TableName: todosTableName,
            Item: {
                id,
                task,
                status,
                userId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };

        const response = await dynamoDB.put(params).promise();
        const todos = await getTodosByUserId(userId);
        console.log(todos);
        res.status(httpStatus.OK).json({
            status: true,
            data: todos,
        });
    } catch (err) {
        console.error("Error creating todo:", err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            error: "Failed to create todo",
        });
    }
});

// Read all todos
app.get("/todos", async (req, res) => {
    try {
        const { userId } = req.query;

        const data = await getTodosByUserId(userId);
        res.status(httpStatus.OK).json({
            status: true,
            data: data,
        });
    } catch (err) {
        console.error("Error fetching todos:", err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            error: "Failed to fetch todos",
        });
    }
});

// Update a todo
app.put("/todo", async (req, res) => {
    const { todoId } = req.query;
    const { status } = req.body;

    try {
        const params = {
            TableName: todosTableName,
            Key: {
                id: todoId,
            },
            UpdateExpression: "SET #statusAlias = :bit, updatedAt = :updatedAt",
            ExpressionAttributeNames: {
                "#statusAlias": "status",
            },
            ExpressionAttributeValues: {
                ":bit": status,
                ":updatedAt": new Date().toISOString(),
            },
            ReturnValues: "ALL_NEW",
        };

        const data = await dynamoDB.update(params).promise();
        console.log(data.Attributes);
        res.status(200).json({
            status: true,
            message: "Task Updated successfully",
            data: data.Attributes,
        });
    } catch (err) {
        console.error("Error updating todo:", err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            error: "Failed to update todo",
        });
    }
});

// Delete a todo
app.delete("/delete", async (req, res) => {
    const { todoId } = req.query;

    try {
        const params = {
            TableName: todosTableName,
            Key: {
                id: todoId,
            },
        };

        const data = await dynamoDB.delete(params).promise();
        console.log(data);
        res.status(200).json({
            status: true,
            message: "Task deleted successfully",
            data: data,
        });
    } catch (err) {
        console.error("Error deleting todo:", err);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            error: "Failed to delete todo",
        });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
