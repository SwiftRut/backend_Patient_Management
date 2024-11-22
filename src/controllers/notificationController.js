import notificationModel from "../models/notificationModel.js";
import patientModel from "../models/patientModel.js";

export const createNotification = async (req, res) => {
  const { userId, type, message } = req.body;

  try {
    const patient = await patientModel.findById(userId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const notification = await notificationModel.create({
      userId,
      type,
      message,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error });
  }
};
export const sendNotification = async (req, res) => {
  try {
      const { userId, type, message } = req.body;

      if (!userId || !type || !message) {
          return res.status(400).json({ error: "Missing required fields" });
      }

      const response = await NotificationService.sendNotification(userId, type, message);
      return res.status(200).json({ success: true, response });
  } catch (error) {
      console.error("Error in sendNotification:", error);
      return res.status(500).json({ success: false, error: error.message });
  }
};

export const getNotificationsForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await notificationModel
      .find({ userId })
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await notificationModel.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.remove();
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error });
  }
};
