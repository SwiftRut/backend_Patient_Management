import express from "express";
import {
  createNotification,
  deleteNotification,
  getNotificationsForUser,
  sendNotification,
  updateDoctor,
  updatePatient
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/createnotification", createNotification);
router.get("/getnotificationforuser", getNotificationsForUser);
router.delete("/deletenotification", deleteNotification);
router.post("/sendNotification", sendNotification);
router.post("/updateDoctor",protect, updateDoctor);
router.post("/updatePatient",protect, updatePatient);

export default router;

