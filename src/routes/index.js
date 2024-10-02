import express from "express";
import patientRoutes from "../routes/patientRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
const router = express.Router();

router.use("/patient", patientRoutes);
router.use("/admin", adminRoutes);

export default router;
