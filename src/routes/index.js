import express from "express";

import insuranceRoutes from "./insuranceRoutes.js"
import appoinmentRoutes from "./appointmentRoutes.js"
import prescriptionRoutes from "./prescriptionRoutes.js"
import universalRoutes from "./universalRoutes.js"
import adminRoutes from "./adminRoutes.js"
import patientRoutes from "./patientRoutes.js"
import doctorRoutes from "./doctorRoutes.js"
import hospitalRoutes from "./hospitalRoutes.js"
import chatRoutes from "./chatRoutes.js"
import calenderRoutes from "./calenderRoutes.js"
const router = express.Router();

router.use("/",universalRoutes);
router.use("/admin", adminRoutes);
router.use("/patient", patientRoutes);
router.use("/doctor", doctorRoutes);
router.use("/hospital", hospitalRoutes);
router.use("/insurance" , insuranceRoutes)
router.use("/appoinment" , appoinmentRoutes)
router.use("/prescription" , prescriptionRoutes)
router.use("/chat" , chatRoutes)
router.use("/calender" , calenderRoutes)


export default router;
