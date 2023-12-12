import dotenv from "dotenv";
dotenv.config({path:'./.env'});

import app from "./app.js";
import mongodbApi from "../src/DB/connect.db.js"



// ------------------------------ setting MONGOOSE database and PORT listen ------------------------------
mongodbApi().then(()=>{
  console.log("-->R: DB connection calling successfull !! \n ");
  app.listen(process.env.PORT, () => {
    console.log(`-->R: http://localhost:${process.env.PORT}`);
  });
}).catch((error)=>{
  console.log("-->E: DB connection calling FAIL !! ", error, " @src/index.js");
});




