import express from "express";


import insuranceRoutes from "./insuranceRoutes.js";
import appoinmentRoutes from "./appointmentRoutes.js";
import prescriptionRoutes from "./prescriptionRoutes.js";
import notificationRoutes from "./notificationRoutes.js";

// aa no path check karvu
import chatRoutes from "./chatRoutes.js";

import patientRoutes from "../routes/patientRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import hospitalRoutes from "../routes/hospitalRoutes.js";
import doctorRoutes from "../routes/doctorRoutes.js";
import billRoutes from "../routes/billRoutes.js";
import universalRoutes from "../routes/universalRoutes.js";


const router = express.Router();

router.use("/", universalRoutes);
router.use("/admin", adminRoutes);
router.use("/patient", patientRoutes);
router.use("/doctor", doctorRoutes);
router.use("/hospital", hospitalRoutes);

router.use("/insurance", insuranceRoutes);
router.use("/appoinment", appoinmentRoutes);
router.use("/prescription", prescriptionRoutes);
router.use("/chat", chatRoutes);
router.use("/notification", notificationRoutes);
router.use("/bill", billRoutes);

router.use("/chat", chatRoutes);

export default router;
