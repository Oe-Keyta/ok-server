import asyncHandler from "../Utils/asyncHandler.util.js";
import { User } from "../models/user.model.js";
import ApiError from "../Utils/apiError.util.js";
import uploadToCloudinary from "../Utils/cloudinary.util.js";
import ApiResponse from "../Utils/apiResponse.util.js";
import sendTokenResponse from "../Utils/sendTokenRes.util.js";
import sendEmail from "../Utils/sendEmail.util.js";
import crypto from "crypto";
// import uploadToImgKit from "../Utils/imageKit.util.js";
// import cloudinary from "cloudinary";

//registration

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { Name, Email, Password, Address, PhoneNumber } = req.body;
        console.log(req.body);
        const validateData = [Name, Email, Password, Address, PhoneNumber].some(
            (field) => field === ""
        );
        if (validateData) throw new ApiError(400, "Required All field !!");

        const exitedUser = await User.findOne({
            $or: [{ Email }, { PhoneNumber }],
        });
        if (exitedUser) {
            throw new ApiError(
                409,
                "Already used Phone Number or Email: " +
                    `${Email} ${PhoneNumber}`
            );
        }

        let avatar = req.file;
        console.log("\n-->R: local avatar path: ", avatar.path, avatar);
        if (!avatar) {
            throw new ApiError(400, "Profile pic is not provided !!");
        }

        // cloudinary
        const avatarCloud = uploadToCloudinary(req.file.path);
        // const avatarCloud = uploadToImgKit(avatarLocalPath);

        console.log("\n--->R: avatar cloud res: ", avatarCloud.url);
        if (!avatarCloud) {
            throw new ApiError(400, "Avatar upload Fail !");
        }

        const newUser = await User.create({
            Name,
            Email,
            Password,
            Address,
            PhoneNumber,
            Avatar: {
                public_id: String(avatarCloud.public_id),
                url: String(avatarCloud.url),
            },
        });

        const createdUser = await User.findById(newUser._id).select(
            "-password -RefreshToken"
        );
        if (!createdUser) {
            throw new ApiError(500, "Registration Fail !!");
        }

        sendTokenResponse(201, newUser, res, "Registration Successful !! 😎");
    } catch (err) {
        res.status(400).json({
            statusCode: err.statusCode,
            Error: err.message,
        });
    }
});

// login
const loginUser = asyncHandler(async (req, res) => {
    try {
        const { Email, Password } = req.body;
        // console.log("login: req.body=> ", req.body);
        if (!Email || !Password) {
            throw new ApiError(400, "Please Enter Email or Password !!");
        }
        const checkingUser = await User.findOne({ Email: Email }).select(
            "+Password"
        );
        if (!checkingUser) {
            throw new ApiError(404, "User doesn't Exist !! -> ");
        }
        const isPasswordMatched = await checkingUser.checkPassword(Password);
        if (isPasswordMatched) {
            sendTokenResponse(
                200,
                checkingUser,
                res,
                "Login Successfull !! 😎"
            );
        } else {
            throw new ApiError(401, "Paswrod Invalid !! 😣");
        }
    } catch (err) {
        res.status(404).json({
            statusCode: err.statusCode,
            Error: err.message,
        });
    }
});

//  forgetPassword
const forgotPassword = asyncHandler(async (req, res) => {
    try {
        const { Email, PhoneNumber } = req.body;
        const validUser = await User.findOne({
            $or: [{ Email }, { PhoneNumber }],
        });
        if (!validUser) {
            throw new ApiError(404, "No email or Phone Number is found !!");
        }

        // Reset password Token
        const resetToken = await validUser.getResetPswdToken();

        await validUser.save({ validateBeforeSave: false });

        const resetPswdURL = String(
            `${req.protocol}://${req.get(
                "host"
            )}/user/password/reset/${resetToken}`
        );
        const message = `Click here to reset password ${resetPswdURL} ALERT !! 🤯: if You didn't request reset password, delete this mail.`;

        await sendEmail({
            email: validUser.Email,
            subject: "oekeyta.com: Password Recovery Portal",
            mailContent: message,
        });

        res.status(200).json({
            success: true,
            message: `Email is sent to ${validUser.Email} successfully`,
        });
    } catch (err) {
        res.status(404).json({
            statusCode: err.statusCode,
            message: err.message,
        });
    }
});

//  resetPassword
const resetPassword = asyncHandler(async (req, res) => {
    try {
        // console.log("reset password: ",req.params, req.body);
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const resetUser = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!resetUser) {
            throw new ApiError(
                400,
                "Reset Password Token is invalid or Expired !"
            );
        }
        const { resetPassword, confirmPassword } = req.body;
        if (resetPassword !== confirmPassword) {
            throw new ApiError(400, "Password mismatched !!");
        }
        // save confirmed password
        resetUser.Password = confirmPassword;
        resetUser.resetPasswordToken = undefined;
        resetUser.resetPasswordExpire = undefined;
        await resetUser.save();

        sendTokenResponse(
            200,
            resetUser,
            res,
            "Reset Password Successfull !! 😎"
        );
    } catch (err) {
        res.status(400).json({
            routes: "reset password !!",
            statusCode: 400,
            message: err.message,
        });
    }
});

// -------> required authenticated tokenization routes <---------
// logout
const logOut = asyncHandler(async (req, res) => {
    try {
        res.cookie("Token ", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        const user = req.user; // logged out user detail

        res.status(200).json(
            new ApiResponse(200, { user }, "LogOut Successfull !! 😎")
        );
    } catch (err) {
        res.status(400).json(new ApiError(400, err));
    }
});

// updatePassword
const updatePassword = asyncHandler(async (req, res, next) => {
    try {
        // console.log("update pswd:: ", req.user, req.body);
        const user = await User.findOne(req.user._id).select("+Password");
        if (!user) {
            throw new ApiError(401, "User is not verified !!🤪");
        }

        const { oldPassword, newPassword, confirmPassword } = req.body;
        const checkCurrentGivePswd = await user.checkPassword(oldPassword);
        if (!checkCurrentGivePswd) {
            throw new ApiError(400, "Old Password is incorrect !!");
        }
        if (newPassword !== confirmPassword) {
            throw new ApiError(
                400,
                "Recheck the change and confirm passwords !"
            );
        }

        // update pswd with confirmPassword
        user.Password = confirmPassword;
        await user.save();

        sendTokenResponse(
            200,
            user,
            res,
            "Password Updated Successfully !! 😎"
        );
    } catch (err) {
        res.status(400).json({
            route: "update password",
            statusCode: err.statusCode,
            message: err.message,
        });
    }
});

//  getUserDetails
const getUserDetails = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findOne(req.user._id);
        if (!user) {
            throw new ApiError(404, "Users' detail is not found !!");
        }

        sendTokenResponse(200, user, res, "User Details !! 😎");

    } catch (err) {
        res.status(404).json({
            route: "get user details",
            statusCode: err.statusCode,
            message: err.message,
        });
    }
});

// update Profile
const updateProfile = asyncHandler(async (req, res, next) => {
    res.status(200).json(new ApiResponse(200, {}, "Update Profile !"));
});

// getAllUsers
const getAllUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(new ApiResponse(200, {}, "Get All Users!"));
});

// getSingleUser : for admin
const getSingleUser = asyncHandler(async (req, res, next) => {
    res.status(200).json(
        new ApiResponse(200, {}, "Get Single User: admin Details !")
    );
});

// updateUserRole: for admin
const updateUserRole = asyncHandler(async (req, res, next) => {
    res.status(200).json(new ApiResponse(200, {}, "Update User Role: admin!"));
});

// deleteUser : for admin
const deleteUser = asyncHandler(async (req, res, next) => {
    res.status(200).json(new ApiResponse(200, {}, "Delete User !"));
});

export {
    registerUser,
    loginUser,
    logOut,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser,
};
