import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  registerAdmin,
  loginAdmin,
  forgotPassword,
  resetPassword,
  getProfile,
  getAllAdmins,
  editProfile,
  changePassword,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.get("/profile/:id", protect, getProfile);

router.get("/all", getAllAdmins);

router.put("/edit-profile/:id", editProfile);

router.put("/change-password/:id", protect, admin, changePassword);

export default router;
