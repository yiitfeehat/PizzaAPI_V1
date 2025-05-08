"use strict";

const CustomError = require("../helpers/customError");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const Token = require("../models/token");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports = {
    login: async (req, res) => {
        /*
          #swagger.tags = ["Authentication"]
          #swagger.summary = "Login"
          #swagger.description = 'Login with username (or email) and password for get simpleToken and JWT'
          #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
              "username": "test",
              "password": "aA12345.?"
            }
          }
        */

        const { username, email, password } = req.body;

        if (!((email || username) && password)) {
            throw new CustomError("username/email and password are required", 401);
        }

        const user = await User.findOne({ $or: [{ email }, { username }], password });
        if (!user) throw new CustomError("Incorrect email/username or password", 401);
        if (!user.isActive) throw new CustomError("This accounts is not active");

        // Simple Token
        let tokenData = await Token.findOne({ userId: user._id });
        if (!tokenData) {
            tokenData = await Token.create({
                userId: user._id,
                token: passwordEncrypt(Date.now() + user._id)
            });
        }

        // JWT Token
        const accessData = {
            _id: user._id,
            username: user.username,
            isActive: user.isActive,
            isAdmin: user.isAdmin
        };

        const accessToken = jwt.sign(accessData, process.env.ACCESS_KEY, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_KEY, { expiresIn: '1d' });

        res.status(200).send({
            error: false,
            Bearer: {
                access: accessToken,
                refresh: refreshToken
            },
            simpleToken: tokenData.token,
            message: "ok kanka girdin"
        });
    },

    logout: async (req, res) => {
        /*
          #swagger.tags = ["Authentication"]
          #swagger.summary = "Logout"
        */

        const auth = req.headers.authorization;
        if (!auth) throw new CustomError("Authorization header missing", 401);

        const tokenArr = auth.split(" ");
        if (tokenArr[0] === "Token") {
            const result = await Token.deleteOne({ token: tokenArr[1] });
            if (result.deletedCount === 0) throw new CustomError("Token not found", 404);

            res.status(200).send({
                error: false,
                message: "Simple token removed"
            });

        } else if (tokenArr[0] === "Bearer") {
            res.status(200).send({
                error: false,
                message: "JWT: No need any action for logout"
            });
        } else {
            throw new CustomError("Invalid token type", 400);
        }
    },

    refresh: async (req, res) => {
        /*
                #swagger.tags = ["Authentication"]
                #swagger.summary = "Refresh"
                #swagger.description = 'Refresh with refreshToken for get accessToken'
                #swagger.parameters["body"] = {
                    in: "body",
                    required: true,
                    schema: {
                        refresh:"...refreshToken..."
                    }
                }
            */

        const { refresh } = req.body;
        if (!refresh) throw new CustomError("Refresh Token not found", 404);

        let refreshData;
        try {
            refreshData = jwt.verify(refresh, process.env.REFRESH_KEY);
        } catch (err) {
            throw new CustomError("JWT Refresh Token is wrong", 403);
        }

        const user = await User.findById(refreshData._id);
        if (!user) throw new CustomError("id doesn not match with JWT Refresh token's id");
        if (!user.isActive) throw new CustomError("This account is not active.");

        const accessData = {
            _id: user._id,
            username: user.username,
            isActive: user.isActive,
            isAdmin: user.isAdmin
        };

        const accessToken = jwt.sign(accessData, process.env.ACCESS_KEY, { expiresIn: '15m' });

        res.status(200).send({
            error: false,
            message: "ok kanka refreshledin",
            access: accessToken
        });
    }
};
