import express from "express";
import {
  createNotification,
  deleteNotification,
  getNotificationsForUser,
  sendNotification,
  updateDoctor,
  updatePatient,
  markAsRead,
  markAllAsRead
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/createnotification", createNotification);
router.get("/getnotificationforuser/:userId", protect, getNotificationsForUser);
router.delete("/deletenotification/:id", protect, deleteNotification);
router.post("/sendNotification", sendNotification);
router.post("/updateDoctor", protect, updateDoctor);
router.post("/updatePatient", protect, updatePatient);
router.put("/markAsRead/:notificationId", protect, markAsRead);
router.put("/markAllAsRead/:userId", protect, markAllAsRead);

export default router;

