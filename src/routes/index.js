import express from "express";
import patientRoutes from "../routes/patientRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import hospitalRoutes from "../routes/hospitalRoutes.js";
import doctorRoutes from "../routes/doctorRoutes.js";

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/patient", patientRoutes);
router.use("/doctor", doctorRoutes);
router.use("/hospital", hospitalRoutes);

export default router;
