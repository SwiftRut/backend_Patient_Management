import express from "express";
import { doctor, protect } from "../middlewares/authMiddleware.js";
import {
  registerDoctor,
  loginDoctor,
  addDoctor,
  getDoctorById,
  getAllDoctors,
  editDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";

const router = express.Router();

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.post("/addDoctor", addDoctor);
router.get("/getDoctorById/:id", getDoctorById);
router.get("/getAllDoctors", getAllDoctors);
router.put("/editDoctor/:id", editDoctor);
router.delete("/deleteDoctor/:id", deleteDoctor);


export default router;
