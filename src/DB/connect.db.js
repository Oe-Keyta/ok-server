import mongoose from "mongoose";

const mongdbApi = async() =>{

    try{
       const connectionDBResponse = await mongoose.connect(process.env.MONGODB_URL);
       console.log(`-->R: Successfully connected to db !!: at HOST: ${connectionDBResponse.connection.host}`);

    } catch (error){
        console.log("-->E: DBapi connect: \n", error);
        process.exit(1);
    }
};

export default mongdbApi;