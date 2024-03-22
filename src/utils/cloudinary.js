import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "../Errors/customErrorClass";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    const res = await cloudinary.uploader.upload(localFilePath);
    console.log(res);
  } catch (error) {
    fs.unlink(localFilePath, (err) => {
      if (err) throw new ApiError(500, "could not delete file");
      console.log("file deleted successfully");
    });
    console.log("cloud err", error);
    throw new ApiError(
      500,
      "something went wrong while uploading files on cloudinary"
    );
  }
};

export { uploadOnCloudinary };
