import Router from "express";
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReview,
    deleteReview,
    getAdminSpecificProducts,
} from "../Controllers/product.controller.js";

import {
    isAuthenticatedUser,
    authorizeRoles,
} from "../Middlewares/auth.middleware.js";

const productRouter = Router();

productRouter.route("/all").get(getAllProducts);
productRouter.route("/detail/:id").get(getProductDetails);

productRouter
    .route("/admin/create")
    .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
productRouter
    .route("/admin/all")
    .get(
        isAuthenticatedUser,
        authorizeRoles("admin"),
        getAdminSpecificProducts
    );
productRouter
    .route("/admin/update/:id")
    .patch(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

productRouter
    .route("/review/:id")
    .patch(isAuthenticatedUser, createProductReview);
productRouter
    .route("/review/delete/:id/:rid")
    .delete(isAuthenticatedUser, deleteReview);

export default productRouter;
