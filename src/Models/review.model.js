import mongoose from "mongoose";

const reviewScheme = new mongoose.Schema(
    {
        Text: {
            type: String,
            required: true
        },
        WrittenBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
    }
);

export const Review = mongoose.model("Review", reviewScheme);