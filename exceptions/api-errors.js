class ApiErorrs extends Error {
    status;
    error;
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiErorrs(401, "Unoathorized access to resource");
    }

    static BadRequest(message, errors = []) {
        return new ApiErorrs(400, message, errors);
    }

    static Conflict(message, errors = []) {
        return new ApiErorrs(409, message, errors);
    }
}

module.exports = ApiErorrs;
