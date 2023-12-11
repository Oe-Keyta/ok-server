import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        catelog: {
            type: String,
            required: true,
            default: null
        },
    },
    {
        timestamps: true,
    }
);

export const Category = mongoose.model("Category", categorySchema);
