import { Product } from "../Models/product.model.js";
import ApiError from "../Utils/apiError.util.js";
import asyncHandler from "../Utils/asyncHandler.util.js";
import uploadToCloudinary from "../Utils/cloudinary.util.js";

const createProduct = asyncHandler(async (req, res, next) => {
    try {
        // console.log(req.body, req.user)
        // let productImages = [];
        // if (typeof req.body.ProductImages === "string") {
        //     productImages.push(req.body.ProductImages);
        // } else {
        //     productImages = req.body.ProductImages;
        // }

        // const imgLinks = [];
        // for (let i = 0; i < productImages.length; i++) {

        //     const cloudRes = await uploadToCloudinary(productImages[i],{
        //         folder: "products"
        //     });

        //     imgLinks.push({
        //         public_id: String(cloudRes.public_id),
        //         url: String(cloudRes.secure_url),
        //     });
        // }

        // req.body.ProductImages = imgLinks;
        req.body.Owner = req.user.id;

        const newProduct = await Product.create(req.body);
        if (!newProduct) {
            throw new ApiError(400, "Product Post Failed !!");
        }

        res.status(200).json({
            statusCode: 200,
            message: "createProducts !! 😎",
            data: newProduct,
        });
    } catch (err) {
        res.status(400).json({
            route: "createProduct",
            statusCode: 400,
            message: err.message,
        });
    }
});

const getAllProducts = asyncHandler(async (req, res, next) => {
    try {
        const allProducts = await Product.find();
        if (!allProducts) {
            throw new ApiError(404, "Null dataset or Server Error !!");
        }

        res.status(200).json({
            statusCode: 200,
            message: "getAllProuducts Successful !! 😎",
            Data: allProducts,
        });
    } catch (err) {
        res.status(404).json({
            route: "getAllProducts",
            statusCode: err.statusCode,
            message: err.message,
        });
    }
});

const getAdminSpecificProducts = asyncHandler(async (req, res, next) => {
    try {
        const adminId = req.user.id;
        console.log(adminId);
        if (!adminId) {
            throw new ApiError(404, "Invalid admin user !!");
        }
        const allProducts = await Product.find({ Owner: adminId });
        if (!allProducts) {
            throw new ApiError(404, "No product is posted yet !! ");
        }
        res.status(200).json({
            statusCode: 200,
            message: "get Admin Specific Products Successfull !! 😎",
            ofOwner: req.user,
            data: allProducts,
        });
    } catch (err) {
        res.status(400).json({
            route: "getAdminSpecificProducts",
            statusCode: err.statusCode,
            message: err.message,
        });
    }
});

const getProductDetails = asyncHandler(async (req, res, next) => {
    try {
        // console.log("Product id: ", req.params.id)
        const product = await Product.findById(req.params.id);

        if (!product) {
            throw new ApiError(404, "Product doesn't exist !!");
        }

        res.status(200).json({
            statusCode: 200,
            message: "getProductDetails Successfull !! 😎",
            data: product,
        });
    } catch (err) {
        res.status(400).json({
            route: "getProductDetails",
            statusCode: err.statusCode,
            message: err.message,
        });
    }
});

const updateProduct = asyncHandler(async (req, res, next) => {
    try {
        // console.log("Update: \n", req.params.id, req.user)

        const product = await Product.findById(req.params.id);
        if (!product) {
            throw new ApiError(404, "Product doesn't exist !!");
        }

        // Checking owner
        if (product.Owner !== req.user._id) {
            throw new ApiError(401, "You aren't allow to edit !! ");
        }

            (product.Name = req.body.Name),
            (product.Desc = req.body.Desc),
            (product.Price = req.body.Price),
            (product.Stock = req.body.Stock),
            (product.Category = req.body.Category);

        // Need to work on image updating

        await product.save();
        res.status(200).json({
            statusCode: 200,
            message: "updateProducts Successfull !! 😎",
            data: product,
        });
    } catch (err) {
        res.status(400).json({
            route: "updateProduct",
            statusCode: err.statusCode,
            message: err.message,
        });
    }
});

const deleteProduct = asyncHandler(async (req, res, next) => {
    try {

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            statusCode: 200,
            message: "product Deletion Successful !! 😎",
        });
    } catch (err) {
        res.status(400).json({
            route: "deleteProduct",
            statusCode: err.statusCode,
            message: err.message
        });
    }
});

const createProductReview = asyncHandler( async(req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        const user = req.user;
        if(!product){
            throw new ApiError(404, "Product Not found !!");
        }
        const review = {
            reviewer: user.id,
            name: user.Name,
            rate: req.body.rate,
            comment: req.body.comment
        };
       const reviewRes = product.Reviews.push(review);
        if(!reviewRes){
            throw new ApiError(400, "Reviewing Failed !!");
        }

        // Rating
        let totalRating = 0
        for(const item of product.Reviews.values()){
            totalRating += item.rate;
        }

        product.Rating = totalRating/((product.Reviews).length);
        await product.save();

        res.status(200).json({
            statusCode: 200,
            message: "createProductReview Successfull !! 😎",
            data: product
        });
    } catch (err) {
        res.status(400).json({
            route: "createProductReview",
            statusCode: err.statusCode,
            message: err.message,
        });
    }
});

const deleteReview = asyncHandler( async(req, res, next) => {
    try {

        const product =  await Product.findById(req.params.id);
        const delReview = product.Reviews.find((review)=> review.id === req.params.rid);
        if(!delReview){
            throw new ApiError(404, "No such review exist !!");
        }

        // console.log(delReview);
        // console.log("\ndeleter: ",req.user.id, String(delReview.reviewer));
        
        if(req.user.id !== String(delReview.reviewer)){
            throw new ApiError(401, `${req.user.Name} is unauthorized to delete!!`);
        }

        product.Reviews.pop(delReview)
        await product.save();

        res.status(200).json({
            statusCode: 200,
            message: "deleteReview Successfull !! 😎",
        });

    } catch (err) {
        res.status(400).json({
            route: "deleteReview",
            statusCode: err.statusCode,
            message: err.message,
        });
    }
});

export {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReview,
    deleteReview,
    getAdminSpecificProducts,
};
