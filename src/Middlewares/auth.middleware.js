import ApiError from "../Utils/apiError.util.js";
import asyncHandler from "../Utils/asyncHandler.util.js";
import Jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
try{    const { Token } = req.cookies;

    if (!Token) {
        throw new ApiError(401, '--> auth.mdlware.E: Token is null ')
    }

    // verify tokenized user
    const verifyUser = Jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(verifyUser._id);

    next();
    }catch(err){
         return next({
            statusCode: err.statusCode,
            message: err.message
         } );
    }
});



const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.Role)) {
            return next(
                new ApiError(
                    (statusCode = 403),
                    (message = `${req.user.Role} isn't allowed !`)
                )
            );
        }

        next();
    };
};
export { isAuthenticatedUser, authorizeRoles };
