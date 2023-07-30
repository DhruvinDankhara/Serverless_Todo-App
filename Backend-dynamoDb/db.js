var AWS = require("aws-sdk");

// AWS.config.update({
//     accessKeyId: process.env.accessKeyId,
//     secretAccessKey: process.env.secretAccessKey,
//     region: process.env.region,
// });

AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    sessionToken: process.env.aws_session_token, // e.g., 'us-east-1'
    region: "us-east-1",
});

const db = new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true });
module.exports = db;
