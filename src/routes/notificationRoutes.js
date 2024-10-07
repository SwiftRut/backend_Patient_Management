import express from "express";
import { createNotification, deleteNotification, getNotificationsForUser } from "../controllers/notificationController";
const router = express.Router()


router.post("/createnotification" , createNotification)
router.get("/getnotificationforuser" , getNotificationsForUser)
router.delete("/deletenotification" , deleteNotification)


export default router