const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const { body } = require("express-validator");
const router = new Router();
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/register", [body("email").isEmail(), body("password").isLength({ min: 3, max: 32 })], (req, res, next) => {
    userController.registration(req, res, next);
});

router.post("/login", (req, res, next) => {
    userController.logIn(req, res, next);
});

router.post("/logout", (req, res, next) => {
    userController.logOut(req, res, next);
});

router.get("/activation/:link", (req, res, next) => {
    userController.activate(req, res, next);
});

router.get("/refresh", (req, res, next) => {
    userController.refresh(req, res, next);
});

router.get("/users", authMiddleware, (req, res, next) => {
    userController.getUsers(req, res, next);
});

module.exports = router;
