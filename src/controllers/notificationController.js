import doctorModel from "../models/doctorModel.js";
import notificationModel from "../models/notificationModel.js";
import patientModel from "../models/patientModel.js";
import NotificationService from "../services/NotificationService.js";
export const createNotification = async (userId, type, message, io) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      message,
      isRead: false,
    });

    // Emit notification via Socket.IO
    const recipientSocketId = onlineUsers.get(userId);
    if (recipientSocketId && io) {
      io.to(recipientSocketId).emit("notification", { message, type });
    }
    console.log(`Notification saved and sent to user ${userId}`);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
export const sendNotification = async (req, res) => {
  try {
    const { deviceToken, title, body } = req.body;
    if (!deviceToken || !title || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await NotificationService.sendNotification(
      deviceToken,
      title,
      body
    );
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
      .sort({ createdAt: -1 })
      .limit(50);

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

export const updateDoctor = async (req, res) => {
  const { token: deviceToken } = req.body;

  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { _id: req.user.id },
      { deviceToken },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res
      .status(200)
      .json({ message: "Doctor token updated successfully", doctor });
  } catch (error) {
    console.error("Error updating doctor token:", error);
    res.status(500).json({ message: "Error updating doctor token", error });
  }
};

export const updatePatient = async (req, res) => {
  const { token: deviceToken } = req.body;

  try {
    const patient = await patientModel.findOneAndUpdate(
      { _id: req.user.id },
      { deviceToken },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res
      .status(200)
      .json({ message: "Patient token updated successfully", patient });
  } catch (error) {
    console.error("Error updating patient token:", error);
    res.status(500).json({ message: "Error updating patient token", error });
  }
};

export const markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking notification as read", error });
  }
};

export const markAllAsRead = async (req, res) => {
  const { userId } = req.params;

  try {
    await notificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking all notifications as read", error });
  }
};
