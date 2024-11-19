import express from "express";
import { doctor, protect } from "../middlewares/authMiddleware.js";
import {
  AddPriscription,
  getPrescriptionById,
  getOldPrescriptions,
  getPrescription,
  getPrescriptionsByDate,
  getTodaysPrescriptions,
  searchPrescriptionsByPatientName,
  SinglePrescription,
} from "../controllers/prescriptionController.js";
import authorize from "../middlewares/roleMiddleware.js";
const router = express.Router();

router.post("/createprescription/:id", protect, authorize(["patient", "doctor"]) , AddPriscription);
router.get("/getPrescriptionById/:id", protect, authorize(["patient", "doctor"]) , getPrescriptionById);
router.get("/getPrescription", protect, authorize(["patient", "doctor"]) , getPrescription);
router.get("/todayPrescription", protect, authorize(["patient", "doctor"]) , getTodaysPrescriptions);
router.get("/oldPrescription", protect, authorize(["patient", "doctor"]) , getOldPrescriptions);
router.get(
  "/searchprescriptions",
  protect,
  authorize(["patient", "doctor"]) ,
  searchPrescriptionsByPatientName
);
router.get("/searchingdate", protect, authorize(["patient", "doctor"]) , getPrescriptionsByDate);
router.get("/SinglePrescription/:id", protect, authorize(["patient", "doctor"]) , SinglePrescription);

export default router;
