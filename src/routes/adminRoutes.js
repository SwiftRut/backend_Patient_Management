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


//this should be protected for development it is removed
router.get("/profile/:id", getProfile);

router.get("/all", getAllAdmins);


router.patch("/edit-profile/:id", editProfile);

//this should be protected for development it is removed
router.patch("/change-password/:id", changePassword);

export default router;
