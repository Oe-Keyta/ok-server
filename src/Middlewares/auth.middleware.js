import ApiError from "../Utils/apiError.util.js";
import asyncHandler from "../Utils/asyncHandler.util.js";
import Jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
    try {
        const { Token } = req.cookies;

        if (!Token) {
            throw new ApiError(401, "--> auth.mdlware.E: Token is null ");
        }

        // verify tokenized user
        const verifyUser = Jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
        if(!verifyUser){
            throw new ApiError(401, "User is not authenticated !!")
        }

        req.user = await User.findById(verifyUser._id);

        next();
    } catch (err) {
        next({
            statusCode: err.statusCode,
            message: err.message,
        });
    }
});

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
            if (!roles.includes(req.user.Role)) {
                throw new ApiError(
                    403,
                    `Role of ${String(
                        req.user.Role
                    ).toUpperCase()} isn't allowed !`
                );
            }
            next();
        } catch (err) {
            next({
                statusCode: err.statusCode,
                message: err.message,
            });
        }
    };
};
export { isAuthenticatedUser, authorizeRoles };
