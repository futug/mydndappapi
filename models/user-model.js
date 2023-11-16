const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    hasActivated: {
        type: Boolean,
        default: false,
    },
    activationLink: {
        type: String,
        required: true,
    },
});

module.exports = model("User", UserSchema);
