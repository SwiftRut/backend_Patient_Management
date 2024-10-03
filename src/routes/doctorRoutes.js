import express from "express";
import {
  registerDoctor,
  loginDoctor,
  forgotPassword,
  resetPassword,
  addDoctor,
  getDoctorById,
  getAllDoctors,
  editDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";

const router = express.Router();

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/addDoctor", addDoctor);
router.get("/getDoctorById/:id", getDoctorById);
router.get("/getAllDoctors", getAllDoctors);
router.put("/editDoctor/:id", editDoctor);
router.delete("/deleteDoctor/:id", deleteDoctor);

export default router;
