const ApiErorrs = require("../exceptions/api-errors");
const tokenService = require("../services/token-service");

module.exports = function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiErorrs.UnauthorizedError());
        }

        const accesToken = authHeader.split(" ")[1];
        if (!accesToken) {
            return next(ApiErorrs.UnauthorizedError());
        }

        const userData = tokenService.validateAccesToken(accesToken);
        if (!userData) {
            return next(ApiErorrs.UnauthorizedError());
        }

        req.user = userData;
        next();
    } catch (error) {
        return next(ApiErorrs.UnauthorizedError());
    }
};
