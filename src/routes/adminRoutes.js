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

const router = express.Router();

router.post("/register", registerAdmin);

router.post("/login", loginAdmin);

router.get("/profile/:id", getProfile);

router.get("/all", getAllAdmins);

router.patch("/edit-profile/:id", editProfile);

router.patch("/change-password/:id", changePassword);

export default router;
