import express from "express";

import insuranceRoutes from "./insuranceRoutes.js"
import appoinmentRoutes from "./appointmentRoutes.js"
import prescriptionRoutes from "./prescriptionRoutes.js"
import notificationRoutes from "./notificationRoutes.js"
const router = express.Router();

router.use("/",universalRoutes);
router.use("/admin", adminRoutes);
router.use("/patient", patientRoutes);
router.use("/doctor", doctorRoutes);
router.use("/hospital", hospitalRoutes);
  

router.use("/notification" , notificationRoutes)
export default router;
