import mongoose from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: [true, "Please enter name !"],
            trim: true,
            index: true,
        },
        Email: {
            type: String,
            required: [true, "Please enter a email !"],
            unique: true,
            trim: true,
            index: true,
            validate: [validator.isEmail, "Enter Valid email !"],
        },
        Password: {
            type: String,
            required: [true, "Please Enter Your Password"],
            minLength: [4, "Password should be greater than 4 characters"],
            select: false,
        },
        Avatar: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
        Role: {
            type: String,
            default: "user",
        },
        Address: {
            type: String,
            required: [true, "Please enter a Address !"],
            trim: true,
        },
        PhoneNumber: {
            type: String,
            required: [true, "Please Enter a phone Number. !!"],
            maxLength: [14, "Invalid Phone Number !!"],
            minLength: [10, "Invalid Phone Number !!"],
            trim: true,
            unique: true,
            index: true,
        },

        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },

    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    // carefully don't use () => for this middleware
    //  fallsafe for password edited due to user update
    if (!this.isModified("Password")) {
        return next();
    }
    this.Password = await bcrypt.hash(this.Password, 10); // encryption
    next();
});

//  Access Token
userSchema.methods.generateAccessToken = function () {
    // sign (payload, accessSecretToken, expiry)
    return Jwt.sign(
        { _id: this._id, PhoneNumber: this.PhoneNumber },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// check password
userSchema.methods.checkPassword = async function (Password) {
    return (await bcrypt.compare(Password, this.Password)).valueOf(); // checking pswd
};

// Generating psswd reset token
userSchema.methods.getResetPswdToken = async function () {
    // Generate Reset Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hashing and adding resetpsswd token
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // expires in 10 mins

    return resetToken;
};


export const User = mongoose.model("User", userSchema);
