import express from "express";
import {
  createNotification,
  deleteNotification,
  getNotificationsForUser,
  sendNotification
} from "../controllers/notificationController.js";
const router = express.Router();

router.post("/createnotification", createNotification);
router.get("/getnotificationforuser", getNotificationsForUser);
router.delete("/deletenotification", deleteNotification);
router.post("/sendNotification", sendNotification);

export default router;

