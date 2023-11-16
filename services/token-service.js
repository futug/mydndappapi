const jwt = require("jsonwebtoken");
const TokenModel = require("../models/token-model");
class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
        return {
            accessToken,
            refreshToken,
        };
    }

    async saveToken(userId, refreshToken) {
        const userByToken = await TokenModel.findOne({ user: userId });
        if (userByToken) {
            userByToken.refreshToken = refreshToken;
            return userByToken.save();
        }
        const token = await TokenModel.create({ user: userId, refreshToken });
        return token;
    }

    async removeToken(refreshToken) {
        const token = await TokenModel.deleteOne({ refreshToken });
        return token;
    }

    async validateRefreshToken(refreshToken) {
        try {
            const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async validateAccesToken(accesToken) {
        try {
            const userData = jwt.verify(accesToken, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async findToken(refreshToken) {
        const token = await TokenModel.findOne({ refreshToken });
        return token;
    }
}

module.exports = new TokenService();
