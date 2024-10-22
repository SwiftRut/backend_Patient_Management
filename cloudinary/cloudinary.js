import pkg from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const { v2: cloudinary } = pkg;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
