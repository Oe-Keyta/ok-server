import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import ThrowError from "./throwError.util.js";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // upstreaming
        const responseFileUpload = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "image", // to detect itself : use auto
                public_id: `${path.basename(localFilePath)}`,
            }
        );

        if (responseFileUpload) {
            console.log(
                "-->R: File is uploaded successfully at:  ",
                responseFileUpload.url
            );
            fs.unlinkSync(localFilePath);
        } else {
            throw new ThrowError(
                "cloudinary uploader",
                "upload() failure !!",
                "cloudinary.util"
            );
            fs.unlinkSync(localFilePath);
        }

        return responseFileUpload;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log("\n-->util.E: ", error);
        return null;
    }
};

export default uploadToCloudinary;
