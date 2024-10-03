import express from "express";
import patientRoutes from "../routes/patientRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import hospitalRoutes from "../routes/hospitalRoutes.js";
import billRoutes from "../routes/billRoutes.js"
const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/patient", patientRoutes);
router.use("/hospital", hospitalRoutes);
router.use("/bill" , billRoutes)    

export default router;
