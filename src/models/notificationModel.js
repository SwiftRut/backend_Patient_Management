import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "User ID is required"],
    },
    type: {
      type: String,
      enum: ["appointment_reminder", "prescription_ready", "payment_due"],
      required: [true, "Notification type is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

const notificationModel = mongoose.model("Notification", notificationSchema);

export default notificationModel;
