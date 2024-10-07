import express from "express";
import {
  registerPatient,
  loginPatient,
  addPatient,
  getPatientById,
  getAllPatients,
  editPatient,
  deletePatient,
} from "../controllers/patientController.js";
const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.post("/addPatient", addPatient);
router.get("/getPatient/:id", getPatientById);
router.get("/getAllPatient", getAllPatients);
router.put("/editPatient/:id", editPatient); // Edit patient route
router.delete("/deletePatient/:id", deletePatient);

export default router;
