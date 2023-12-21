import { Router } from "express";
import {
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
} from "../Controllers/user.controller.js";

import {
    isAuthenticatedUser,
    authorizeRoles,
} from "../Middlewares/auth.middleware.js";
import { multerUpload } from "../Middlewares/multer.middleware.js";
// import bodyParser from "body-parser";

const userRouter = Router();
// const urlBodyParser = bodyParser.urlencoded({extended:false});
// const jsonBodyParser = bodyParser.json()

userRouter.route("/register").post(multerUpload.single("Avatar"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/password/forgot").post(forgotPassword);
userRouter.route("/password/reset/:token").patch(resetPassword);

userRouter.route("/logout").get(isAuthenticatedUser, logOut);
userRouter.route("/password/update").patch(isAuthenticatedUser, updatePassword);
userRouter.route("/me").get(isAuthenticatedUser, getUserDetails);
userRouter.route("/me/update").patch(isAuthenticatedUser, updateProfile);
userRouter.route("/me/delete").delete(isAuthenticatedUser, deleteUser);

userRouter
    .route("/admin.users")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
userRouter
    .route("/admin.user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

export default userRouter;
