const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const mailService = require("./mail-service");
const TokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiErorrs = require("../exceptions/api-errors");
require("dotenv").config();

class UserService {
    async registration(email, password, username) {
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw ApiErorrs.BadRequest("User with this email already exists");
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = hashPassword;
        const newUser = await UserModel.create({
            email,
            password: hashPassword,
            activationLink,
            username,
        });
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activation/${activationLink}`);

        const userDto = new UserDto(newUser);

        const tokens = TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async logIn(email, password) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiErorrs.BadRequest("User with this email not found");
        }
        const isPasswordEqual = await bcrypt.compare(password, user.password);
        if (!isPasswordEqual) {
            throw ApiErorrs.BadRequest("Incorrect password");
        }
        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        };
    }

    async logOut(refreshToken) {
        const token = await TokenService.removeToken(refreshToken);
        return token;
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink });
        if (!user) {
            throw ApiErorrs.BadRequest("User not found");
        }
        user.hasActivated = true;
        await user.save();
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiErorrs.UnauthorizedError();
        }
        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await TokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiErorrs.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({ ...userDto });
        return {
            ...tokens,
            user: userDto,
        };
    }
}

module.exports = new UserService();
