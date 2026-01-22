import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const uploadImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "Florix" },
      (error, result) => {
        if (error) {
          console.error("Error uploading image to Cloudinary:", error);
          reject({ success: false, error: error.message });
        } else {
          resolve({ success: true, url: result.secure_url, publicId: result.public_id });
        }
      }
    );

    stream.end(fileBuffer);
  });
};


const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId); 
        return { success: true, result };
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        return { success: false, error: error.message };
    }
}

export { uploadImage, deleteImage };