const mysql = require("mysql2/promise");

const config = {
    localhost: {
        host: "localhost",
        user: "root",
        password: "Root@1234",
        database: "Todo",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    },
    awsNew: {
        host: "cloud-term-project-instance-1.c0sfyiynts91.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "Dhruvin782882",
        database: "Todo",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        port: "5432",
    },
};

const connectDB = async () => {
    try {
        const connection = await mysql.createConnection(config.awsNew);
        // console.log("Database connection successfully");
        return connection;
    } catch (error) {
        throw new Error("Error connecting to the database: " + error);
    }
};

module.exports = {
    connectDB,
};
