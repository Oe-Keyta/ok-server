import mongoose from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        Email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        Password: {
            type: String,
            required: true,
        },
        Address: {
            type: String,
            required: true,
            trim: true,
        },
        PhoneNumber: {
            type: Number,
            required: true,
            trim: true,
            unique: true,
            index: true,
        },
        Avatar: {
            type: String, // cloudinary url
            required: true,
        },
        RefreshToken: {
            type: String,
        },
        OrderItems: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
    },
    { timestamps: true }
);

// pre-middle ware for saving user and esp: password
userSchema.pre("save", async function (next) {
    // carefully don't use () => for this middleware
    //  to protect password being modified while modifying the user data
    if (this.isModified("Password")) {
        this.Password = bcrypt.hash(this.Password, 10); // encryption
        next();
    }
});

// to check login given password is correct or not
userSchema.methods.checkPassword = async function (Password) {
    return await bcrypt.compare(Password, this.Password); // checking pswd
};

//  Access Token
userSchema.methods.generateAccessToken = function () {
    // sign (payload, accessSecretToken, expiry)
    return Jwt.sign(
        // payload
        {
            _id: this._id,
            Email: this.Email,
            FullName: this.FullName,
            PhoneNumber: this.PhoneNumber,
        },

        process.env.ACCESS_TOKEN_SECRET, //accessPrivateToken

        //expiry
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// RefreshToken
userSchema.methods.generateRefreshToken = function () {
    Jwt.sign(
        {
            _id: this._id,
            Email: this.Email,
            FullName: this.FullName,
            PhoneNumber: this.PhoneNumber,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};



export const User = mongoose.model("User", userSchema);
