require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const router = require("./router/index");
const errorsMiddleware = require("./middlewares/errors-middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api", router);
app.use(errorsMiddleware);

const PORT = process.env.PORT || 8000;
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        app.listen(PORT, () => console.log("Server successfully launched on PORT: " + PORT + "!"));
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

start();
