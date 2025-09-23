import { v2 as cloudinaryV2 } from "cloudinary";

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const UploadFileOnCloudinary = async (file, options) => {
  const result = await cloudinaryV2.uploader.upload(file, options);
  return result;
};

export const DeleteFileFromCloudinary = async (public_id) => {
  const result = await cloudinaryV2.uploader.destroy(public_id);
  return result;
};

