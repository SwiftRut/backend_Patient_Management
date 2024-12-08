import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  messageContent: { type: String },
  type: {
    type: String,
    enum: ["text", "image", "file", "video"],
    default: "text",
  },
  fileUrl: { type: String },
  fileName: { type: String },
  fileSize: { type: String },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Doctor",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["read", "unread"], default: "unread" },
});

export default mongoose.model("Chat", chatSchema);
