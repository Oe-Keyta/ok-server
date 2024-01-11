import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: [true, "Please Enter product Name"],
        },
        Desc: {
            type: String,
            required: [true, "Please Enter product Description"],
        },
        ProductImages: [
            {
                public_id: {
                    type: String, // cloudinary link
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
        Price: {
            type: Number,
            required: [true, "Please Enter product Price"],
            maxLength: [8, "Price cannot exceeds 8 figures"],
        },
        Stock: {
            type: Number,
            required: [true, "Required Stock Number"],
            maxLength: [3, "Cannot Exceds more than 1000 stock"],
            default: 1,
        },

        // other connection of db
        Category: {
            type: String,
            required: [true, "Enter Product Category"],
        },
        Owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        Reviews: [
            {
                reviewer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                rate: {
                    type: Number,
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                    default: "",
                },
            },
        ],
        Rating: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const Product = mongoose.model("Product", productSchema);
