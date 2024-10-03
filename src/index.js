import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection failed", error);
  });
