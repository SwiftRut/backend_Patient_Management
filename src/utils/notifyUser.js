import notificationModel from "../models/notificationModel.js";

export const notifyUser = async (io, userId, message, type, onlineUsers) => {
  try {
    const notification = new notificationModel({
      userId,
      message,
      type,
      isRead: false,
    });
    await notification.save();
    const recipientSocketId = onlineUsers.get(userId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("notification", { message, type });
    }
  } catch (error) {
    console.error("Error creating or sending notification:", error);
  }
};
