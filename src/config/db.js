import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `Connected to MongoDB || DB_HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

export default connectDB;
