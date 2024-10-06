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

router.post("/forgot_password", forgotPassword);

router.post("/reset_password", resetPassword);

router.get("/profile/:id", protect, getProfile);

router.get("/all", getAllAdmins);

router.patch("/edit-profile/:id", editProfile);

router.patch("/change-password/:id", changePassword);

export default router;
