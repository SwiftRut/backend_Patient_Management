import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    messageContent: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['read', 'unread'], default: 'unread' }
});

 export default mongoose.model('Chat', chatSchema);