import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'participants.role'
  },
  content: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  fileUrl: String,
  fileName: String,
  fileSize: String
});

const chatSchema = new mongoose.Schema(
  {
    participants: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'role'
      },
      role: {
        type: String,
        enum: ['Doctor', 'Patient']
      }
    }],
    messages: [messageSchema]
  },
  { timestamps: true }
);

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;