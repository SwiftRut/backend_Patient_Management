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
import upload from "../../cloudinary/multer.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";
const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.post("/addPatient", addPatient);
router.get("/getPatient/:id",cacheMiddleware, getPatientById);
router.get("/getAllPatient",cacheMiddleware, getAllPatients);
router.put("/editPatient/:id",  upload.single('profilePic'), editPatient); // Edit patient route
router.delete("/deletePatient/:id", deletePatient);

export default router;
