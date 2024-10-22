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
import upload from "../../cloudinary/multer.js";

const router = express.Router();

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.post("/addDoctor", upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'signature', maxCount: 1 }]), addDoctor);
router.get("/getDoctorById/:id", getDoctorById);
router.get("/getAllDoctors", getAllDoctors);
router.put("/editDoctor/:id",upload.single('profilePic'), editDoctor);
router.delete("/deleteDoctor/:id", deleteDoctor);


export default router;
