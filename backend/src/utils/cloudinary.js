import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv";
import fs from "fs"

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localpath) => {

    try {
        if(!localpath) return null
        const responce = await cloudinary.uploader.upload(
            localpath,{
                resource_type:"auto"
            }
        )
    
        console.log("File uploaded on cloudinary. File src",responce.url);
        // fs.unlinkSync(localpath);
    
        return responce
    } catch (error) {
        console.log("Error in Cloudinary",error.message);
        
        // fs.unlinkSync(localpath)
        return null
    }
}


const deleteFromCloudinary = async(publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        console.log("File deleted from cloudinary");
    } catch (error) {
        console.log("Error in cloudinary",error.message);
        
    }
    
}

export {uploadOnCloudinary, deleteFromCloudinary}