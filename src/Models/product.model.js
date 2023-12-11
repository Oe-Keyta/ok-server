import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
        },
        Desc: {
            type: String,
            required: true,
        },
        productImages: [
            {
                type: String, // cloudinary link
            },
        ],
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        stockNumber: {
            type: Number,
            required: true,
            default: 1,
        },

        // other connection of db
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        Owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        Reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
                default: null
            },
        ],
        Rate: {
            type: Number,
            default: null
        },
    },
    {
        timestamps: true,
    }
);

export const Product = mongoose.model("Product", productSchema);
