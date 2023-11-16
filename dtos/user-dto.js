class UserDto {
    email;
    id;
    hasActivated;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.hasActivated = model.hasActivated;
    }
}

module.exports = UserDto;
