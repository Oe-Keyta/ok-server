import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        Products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        Destination: {
            type: String,
            required: true,
        },
        Buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        OrderTime: {
            type: String,
            required: true,
        },
        DelieveryTime: {
            type: String,
            required: true,
        },
        IsDelievered: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true }
);
