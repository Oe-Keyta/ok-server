import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// uploading to cloudinary
const uploadToCloudinary = async (localFilePath) => {
    try {

        if (!localFilePath) return null;

        // uploading
        const responseFileUpload = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // to detect itself the type of file.
        });

        // if successfully upload message
        if(responseFileUpload){
        console.log("-->R: File is uploaded successfully at:  ", responseFileUpload.url);
        // remove from local storage
        fs.unlinkSync(localFilePath);
        }
    } catch (error) {
        // if fails to upload then unlink/remove the lcoal cache file from server
        fs.unlinkSync(localFilePath);
        console.log("\n-->E: Error in uploading file !!");
        return null;
    }
};

export default uploadToCloudinary;
