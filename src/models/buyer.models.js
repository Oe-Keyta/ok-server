import mongoose from "mongoose";

const buyerScheme = new mongoose.Schema({

    Name:{
        type: String,
        required: true
    }

},{timestamps:true});