import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  registerAdmin,
  loginAdmin,
  getProfile,
  getAllAdmins,
  editProfile,
  changePassword,
} from "../controllers/adminController.js";
import {cacheMiddleware}  from "../middlewares/cacheMiddleware.js";
import upload from "../../cloudinary/multer.js";

const router = express.Router();

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.get("/profile/:id",cacheMiddleware, getProfile);

router.get("/all",cacheMiddleware, getAllAdmins);


router.patch("/edit-profile/:id", upload.single('profilePic'), editProfile);

router.patch("/change-password/:id", changePassword);

export default router;
