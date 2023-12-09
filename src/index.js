import dotenv from "dotenv";
dotenv.config({path:'./.env'});

import app from "./app.js";
import mongdbApi from "./DB/connect.js";



// ------------------------------ setting MONGOOSE database and PORT listen ------------------------------
mongdbApi().then(()=>{
  console.log("-->R: DB connection calling successfull !! \n ");
  app.listen(process.env.PORT, () => {
    console.log(`-->R: http://localhost:${process.env.PORT}`);
  });
}).catch((error)=>{
  console.log("-->E: DB connection calling FAIL !! ", error, " @src/index.js");
});




