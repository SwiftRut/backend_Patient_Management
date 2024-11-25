import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // User ID
    message: { type: String, required: true },
    type: { type: String, required: true }, // e.g., "payment", "appointment"
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const notificationModel = mongoose.model("Notification", notificationSchema);

export default notificationModel;
