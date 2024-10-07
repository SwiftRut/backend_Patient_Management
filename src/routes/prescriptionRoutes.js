import express from "express";
import { doctor, protect } from "../middlewares/authMiddleware";
import { AddPriscription, getOldPrescriptions, getPrescription, getPrescriptionsByDate, getTodaysPrescriptions, searchPrescriptionsByPatientName, SinglePrescription } from "../controllers/prescriptionController";
const router = express.Router()


router.post("/createprescription" , protect , doctor , AddPriscription)
router.get("/getPrescription" , protect  , doctor ,getPrescription)
router.get("/todayPrescription",protect,doctor,getTodaysPrescriptions);
router.get("/oldPrescription",protect , doctor , getOldPrescriptions);
router.get("/searchprescriptions",protect, doctor ,searchPrescriptionsByPatientName);
router.get("/searchingdate",protect, doctor , getPrescriptionsByDate);
router.get("/SinglePrescription/:id", protect, doctor ,SinglePrescription)

export default router