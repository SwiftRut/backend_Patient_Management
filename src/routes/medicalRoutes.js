import express from "express";
import { doctor, protect } from "../middlewares/authMiddleware";
import {
  createmedicalrecord,
  deleteMedicalRecord,
  getMedicalRecordById,
  getMedicalRecords,
  updateMedicalRecord,
} from "../controllers/medicalController";
const router = express.Router();

router.post("/cratemedicalreport", protect, doctor, createmedicalrecord);
router.get("/allmedicalrecord", protect, doctor, getMedicalRecords);
router.get("/singlerecord/:id", protect, getMedicalRecordById);
router.put("/updaterecord/:id", protect, doctor, updateMedicalRecord);
router.delete("/deleterecord/:id", protect, deleteMedicalRecord);

export default router;
