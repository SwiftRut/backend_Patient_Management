import express from "express";
import {
  registerPatient,
  loginPatient,
  forgotPassword,
  resetPassword,
} from "../controllers/patientController.js";
const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);

export default router;
