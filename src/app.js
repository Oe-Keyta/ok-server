// dependencies
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

// modules
import jokesFile from "./Data/jokes.js";

const app = express();

// CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        optionsSuccessStatus: 200,
    })
);

// MIDDLEWARES
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static("public")); // to store assets locally in server: img, vdo, pdf, doc, ..etc
app.use(cookieParser()); // cookie-parser

// Routers imports
import userRouter from "./Routes/user.route.js";

//  Route declaration
app.use("/user", userRouter);

// API testing
app.get("/", function (req, res, next) {
    res.json({
        msg: `The server is working on: http://localhost:${process.env.PORT}`,
    });
});

app.get("/jokes", (req, res) => {
    res.send(jokesFile);
});

export default app;
