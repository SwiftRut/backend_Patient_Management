import logger from "./config/logger.js";
import Chat from "./models/chatModel.js";
import { notifyUser } from "./utils/notifyUser.js";

export default (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    logger.info(`A user connected: ${socket.id}`);

    socket.on('userOnline', (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on('joinRoom', ({ doctorId, patientId }) => {
      const room = [doctorId, patientId].sort().join('-');
      socket.join(room);
      socket.emit('joinRoom', { doctorId, patientId });
    });

    socket.on('message', async (data) => {
      try {
        const { doctorId, patientId, senderId, receiverId, messageContent, type, fileUrl, fileName, fileSize } = data;
        const chat = new Chat({ 
          doctorId, 
          patientId, 
          senderId, 
          receiverId, 
          messageContent,
          type,
          fileUrl,
          fileName,
          fileSize 
        });
        await chat.save();

        const room = [doctorId, patientId].sort().join('-');
        io.to(room).emit('message', chat);
      } catch (err) {
        logger.error('Error saving chat message:', err);
      }
    });

    socket.on('sendNotification', async ({ userId, message, type }) => {
      try {
        await notifyUser(io, userId, message, type, onlineUsers);
      } catch (err) {
        logger.error('Error sending notification:', err);
      }
    });

    socket.on('offer', async (data) => {
      try {
        const { offer, room } = data;
        socket.to(room).emit('offer', { offer, room });
      } catch (err) {
        logger.error('Error handling offer:', err);
      }
    });

    socket.on('answer', (data) => {
      try {
        const { answer, room } = data;
        socket.to(room).emit('answer', { answer, room });
      } catch (err) {
        logger.error('Error handling answer:', err);
      }
    });

    socket.on('candidate', (data) => {
      try {
        const { candidate, room } = data;
        socket.to(room).emit('candidate', { candidate, room });
      } catch (err) {
        logger.error('Error handling candidate:', err);
      }
    });

    socket.on('deleteMessage', async (data) => {
      try {
        const { messageId, room } = data;
        await Chat.findByIdAndDelete(messageId);
        io.to(room).emit('messageDeleted', { messageId });
        logger.info(`Message deleted: ${messageId}`);
      } catch (err) {
        logger.error('Error deleting message:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      for (let [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });
};
