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
  getUnavailableTimes,
  addUnavailableTime,
} from "../controllers/doctorController.js";
import upload from "../../cloudinary/multer.js";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";
const router = express.Router();

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.post(
  "/addDoctor",
  protect,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  addDoctor
);
router.get("/getDoctorById/:id", cacheMiddleware, getDoctorById);
router.get("/getAllDoctors", cacheMiddleware, getAllDoctors);
router.put(
  "/editDoctor/:id",
  protect,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "profilePic", maxCount: 1 },
  ]),
  editDoctor
);
router.delete("/deleteDoctor/:id", protect, deleteDoctor);
router.get(
  "/:doctorId/unavailable-times",
  cacheMiddleware,
  getUnavailableTimes
);
router.post("/:doctorId/unavailable-times", protect, addUnavailableTime);

export default router;
