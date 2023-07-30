// author: Mehulkumar Bhunsadiya
const { sign } = require("jsonwebtoken");

const config = {
    secrets: {
        jwt: process.env.jwtSecretKey,
        jwtExp: "30d",
    },
};

const createToken = (user) => {
    return sign(
        {
            userId: user.userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        config.secrets.jwt,
        {
            expiresIn: config.secrets.jwtExp,
        }
    );
};

module.exports = { createToken, config };
