import express from "express";
import { cacheMiddleware } from "../middlewares/cacheMiddleware.js";
const router = express.Router();
import {
  createMessage,
  getChatHistory,
  updateMessageStatus,
  deleteMessage,
  getDoctorContacts,
  getPatientContacts,
} from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

// CRUD operations for chat messages
router.post("/", createMessage);
router.get("/:doctorId/:patientId", protect, cacheMiddleware, getChatHistory);
router.put("/:chatId", updateMessageStatus);
router.delete("/:chatId", deleteMessage);

// Endpoints to retrieve contacts list
router.get(
  "/contacts/patient/:patientId",
  protect,
  cacheMiddleware,
  getDoctorContacts
);
router.get(
  "/contacts/doctor/:doctorId",
  protect,
  cacheMiddleware,
  getPatientContacts
);
export default router;
