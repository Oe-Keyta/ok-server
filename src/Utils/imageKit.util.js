import ImageKit from "imagekit";
import fs from "fs";
import path from "path";
import ThrowError from "../Utils/throwError.util.js";

var imageKit = new ImageKit({
    publicKey: `${process.env.IK_publicKey}=`,
    privateKey: `${process.env.IK_privateKey}=`,
    urlEndpoint: `${process.env.IK_urlEndpoint}`
})

async function uploadToImgKit(localFilePath="") {
    try {
        const imgKitRes = await imageKit.upload({
            file: `${localFilePath}`,

            fileName: `${path.basename(localFilePath)}`,

            customMetadata: {
                category: "Avatar",
            },
        });

        if (!imgKitRes) {
            throw new ThrowError(
                "ImgKitRes",
                ".upload() fail !!",
                "imageKit.util"
            );
        }
        return imgKitRes

    } catch (error) {
        console.log("--->E: ", error);
    }
}

export default uploadToImgKit;
