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
import { protect} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.post("/addPatient", addPatient);
router.get("/getPatient/:id",protect,cacheMiddleware, getPatientById);
router.get("/getAllPatient",cacheMiddleware, getAllPatients);
router.put("/editPatient/:id",protect, upload.single('profilePic'), editPatient); 
router.delete("/deletePatient/:id",protect, deletePatient);

export default router;
