import express from "express";
import patientRoutes from "./patientRoutes.js";
import adminRoutes from "./adminRoutes.js";
import hospitalRoutes from "./hospitalRoutes.js";
import billRoutes from "./billRoutes.js"
import insuranceRoutes from "./insuranceRoutes.js"
const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/patient", patientRoutes);
router.use("/hospital", hospitalRoutes);
router.use("/bill" , billRoutes)   
router.use("/insurance" , insuranceRoutes) 

export default router;
