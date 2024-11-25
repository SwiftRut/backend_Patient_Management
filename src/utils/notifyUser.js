import notificationModel from "../models/notificationModel.js";

export const notifyUser = async (io, userId, message, type, onlineUsers) => {
  try {
    console.log("Sending notification to user:", userId, message, type);
    // Save notification in the database
    const notification = new notificationModel({
      userId,
      message,
      type,
      isRead: false,
    });
    await notification.save();

    // Emit real-time notification if the user is online
    const recipientSocketId = onlineUsers.get(userId);
    console.log(recipientSocketId,"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< from notifyUser");
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('notification', { message, type });
      console.log(`Real-time notification sent to user ${userId}: ${message}`);
    }
  } catch (error) {
    console.error("Error creating or sending notification:", error);
  }
};
