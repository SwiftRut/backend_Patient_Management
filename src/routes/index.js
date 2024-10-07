import express from "express";
import patientRoutes from "./patientRoutes.js";
import adminRoutes from "./adminRoutes.js";
import hospitalRoutes from "./hospitalRoutes.js";
import billRoutes from "./billRoutes.js"
import insuranceRoutes from "./insuranceRoutes.js"
import appoinmentRoutes from "./appointmentRoutes.js"
import prescriptionRoutes from "./prescriptionRoutes.js"
import notificationRoutes from "./notificationRoutes.js"
const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/patient", patientRoutes);
router.use("/hospital", hospitalRoutes);
router.use("/bill" , billRoutes)   
router.use("/insurance" , insuranceRoutes)
router.use("/appoinment" , appoinmentRoutes)
router.use("/presciption" , prescriptionRoutes)
router.use("/notification" , notificationRoutes)
export default router;
