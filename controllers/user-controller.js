const UserService = require("../services/user-service");
const UserModel = require("../models/user-model");
const { validationResult } = require("express-validator");
const ApiErorrs = require("../exceptions/api-errors");

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiErorrs.BadRequest("Validation error", errors.array()));
            }
            const { email, password, username } = req.body;
            const userData = await UserService.registration(email, password, username);
            res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async logIn(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await UserService.logIn(email, password);
            res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async logOut(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await UserService.logOut(refreshToken);
            res.clearCookie("refreshToken");
            return res.json(token);
        } catch (error) {
            next(error);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await UserService.activate(activationLink);
            res.redirect(process.env.CLIENT_URL);
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await UserService.refresh(refreshToken);
            res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await UserModel.find();
            res.json(users);
        } catch (error) {
            next(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = new UserController();
