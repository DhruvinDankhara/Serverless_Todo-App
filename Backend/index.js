require("dotenv").config();
const express = require("express");
const httpStatus = require("http-status");
const { hash, compare } = require("bcrypt");
const helmet = require("helmet");
const cors = require("cors");
const { connectDB } = require("./db");
const AWS = require("aws-sdk");
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
// app.options("*", cors());

AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    sessionToken: process.env.aws_session_token, // e.g., 'us-east-1'
});
const connection = connectDB();

const securePassword = async (password) => {
    const hashedPassword = await hash(password, 9);
    return hashedPassword;
};

const comparePassword = async (password, hashPassword) => {
    return compare(password, hashPassword);
};

app.use("/health-check", async (req, res, next) => {
    console.log();
    res.status(httpStatus.OK).json({
        status: true,
        message: "Server is online",
    });
});

app.post("/login", async (req, res) => {
    try {
        const body = req.body;
        console.log(body);
        const query = `select * from users where email = "${body?.email}";`;
        const result = (await (await connection).query(query))[0][0];
        console.log(result);
        const matched = await comparePassword(body.password, result.password);
        if (!matched) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: "password mismatch",
            });
        } else {
            res.status(httpStatus.OK).json({
                status: true,
                message: "login successfull",
                data: result,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
        });
    }
});

app.post("/sign-up", async (req, res) => {
    try {
        const body = req.body;
        const hashedPassword = await securePassword(body?.password);
        console.log(hashedPassword);
        const query = `INSERT INTO users (firstName, lastName, password, email) VALUES ("${
            body.firstName
        }","${
            body.lastName
        }","${hashedPassword}","${body.email.toLowerCase()}")`;
        await (await connection).query(query);
        res.status(httpStatus.OK).json({
            status: true,
            message: "user created successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Error in creating user",
        });
    }
});

app.post("/create-todo", async (req, res, next) => {
    try {
        const body = req.body;
        console.log(body);
        const query = `insert into Todo.tasks (task,status,user_id) Values ("${body.task}","PENDING",${body.userId});`;
        const result = await (await connection).query(query);
        console.log(result);
        res.status(httpStatus.OK).json({
            status: true,
            message: "Todo inserted successfully",
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
        });
    }
});

app.get("/todos", async (req, res) => {
    try {
        const { userId } = req.query;
        const query = `SELECT * FROM Todo.tasks where user_id = ${userId} order by created_at DESC`;
        console.log(query);
        const result = (await (await connection).query(query))[0];
        res.status(200).json({
            status: true,
            data: result,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put("/todo", async (req, res, next) => {
    try {
        const { todoId } = req.query;
        const body = req.body;
        console.log(body);
        const query = `update Todo.tasks set status="${body.status}" where id = ${todoId};`;
        console.log(query);
        (await (await connection).query(query))[0];
        res.status(200).json({
            status: true,
            message: "Task Updated successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/delete", async (req, res) => {
    try {
        const { todoId } = req.query;
        const query = `Delete FROM Todo.tasks where id = ${todoId};`;
        const result = (await (await connection).query(query))[0];
        res.status(200).json({
            status: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node API app is running on port :`, PORT);
});
