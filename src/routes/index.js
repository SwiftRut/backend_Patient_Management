import express from "express";

import patientRoutes from "./patientRoutes.js";
import adminRoutes from "./adminRoutes.js";
import hospitalRoutes from "./hospitalRoutes.js";
import billRoutes from "./billRoutes.js";
import insuranceRoutes from "./insuranceRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import aggregationRoutes from "../routes/aggregationRoutes.js";

import adminModel from "../models/adminModel.js";
import doctorModel from "../models/doctorModel.js";
import patientModel from "../models/patientModel.js";
import { loginAdmin } from "../controllers/adminController.js";
import { loginDoctor } from "../controllers/doctorController.js";
import { loginPatient } from "../controllers/patientController.js";
const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/patient", patientRoutes);
router.use("/doctor", doctorRoutes);
router.use("/hospital", hospitalRoutes);
router.use("/bill", billRoutes);
router.use("/aggregation", aggregationRoutes);

router.use("/insurance", insuranceRoutes);
router.use("/appoinment", appoinmentRoutes);
router.use("/presciption", prescriptionRoutes);
router.post("/universal-login", async (req, res) => {
  const { identifier, password, rememberMe } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email/phone and password" });
  }

  try {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const normalizedPhone = identifier.trim().replace(/[\s\+\-\(\)]/g, "");
    console.log("Normalized Identifier:", normalizedIdentifier);
    console.log("Normalized Phone:", normalizedPhone);
    const admin = await adminModel.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
    });

    if (admin) {
      return loginAdmin(req, res);
    }

    const doctor = await doctorModel.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
    });

    if (doctor) {
      return loginDoctor(req, res);
    }

    const patient = await patientModel.findOne({
      $or: [{ email: normalizedIdentifier }, { phone: normalizedPhone }],
    });
    console.log("Patient:", patient);
    console.log("Doctor:", doctor);
    console.log("Admin:", admin);
    if (patient) {
      return loginPatient(req, res);
    }

    return res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Error during universal login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
