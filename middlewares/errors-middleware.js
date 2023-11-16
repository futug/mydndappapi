const ApiErorrs = require("../exceptions/api-errors");

module.exports = function (err, req, res, next) {
    console.log(err);
    if (err instanceof ApiErorrs) {
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }
    return res.status(500).json({ message: "Internal server error" });
};
