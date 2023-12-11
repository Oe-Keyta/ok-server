import mongoose from "mongoose";

const retailSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        Address:{
            type: String,
            required: true,
            trim: true
        },

        RetailerId:{
            type: String, 
            trim: true
        },
        PhoneNumber: {
            type: Number,
            required: true,
            trim: true,
            unique: true,
            index: true,
        },
        Gmail:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        Password:{
            type: String,
            required: true
        }
    },
    { timestamps: true }
);
