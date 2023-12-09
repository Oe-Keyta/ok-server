// dependencies
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// modules
import jokesFile from "./Data/jokes.js";

const app = express();

// ------------------------------ CORS ------------------------------
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200 
}));


// ------------------------------ MIDDLEWARES -----------------------------

app.use(express.json({limit:'16kb'}));  // accept json format 

app.use(express.urlencoded({extended: true, limit:'16kb'})); // accept from other url

app.use(express.static("public")) // to store assets locally in server: img, vdo, pdf, doc, ..etc

app.use(cookieParser()); //cookie-parser




// ------------------------------ API testing ------------------------------
app.get("/", function (req, res, next) {
    res.json({ msg: `Enabling the CORS for only ${corsOptions.origin}` });
});

app.get("/jokes", (req, res) => {
    res.send(jokesFile);
});







export default app;
