import Chat from "./models/chatModel.js";
import { notifyUser } from "./utils/notifyUser.js";

export default (io) => {
  // Store connected users
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user login and map their socket ID
    socket.on('userOnline', (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} is online with socket ID >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>: ${socket.id}`);
    });

    // Handle joining a room
    socket.on('joinRoom', ({ doctorId, patientId }) => {
      const room = [doctorId, patientId].sort().join('-');
      console.log(`${socket.id} joined room: ${room}`);
      socket.join(room);
      socket.emit('joinRoom', { doctorId, patientId });
    });

    // Handle sending a chat message
    socket.on('message', async (data) => {
      try {
        const { doctorId, patientId, senderId, receiverId, messageContent } = data;

        // Save the chat message to the database
        const chat = new Chat({ doctorId, patientId, senderId, receiverId, messageContent });
        await chat.save();

        const room = [doctorId, patientId].sort().join('-');
        io.to(room).emit('message', chat); // Emit message to the room
        console.log(`Message sent in room ${room}`);
      } catch (err) {
        console.error('Error saving chat message:', err);
      }
    });

    // **Notification Logic**: Send notifications for specific events
    socket.on('sendNotification', async ({ userId, message, type }) => {
      try {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Sending notification to user:", userId);
        await notifyUser(io, userId, message, type, onlineUsers);
      } catch (err) {
        console.error('Error sending notification:', err);
      }
    });

    // Handle WebRTC offer
    socket.on('offer', async (data) => {
      try {
        const { offer, room } = data;
        console.log(`Offer sent to room: ${room}`, offer);
        socket.to(room).emit('offer', { offer, room });
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    });

    // Handle WebRTC answer
    socket.on('answer', (data) => {
      try {
        const { answer, room } = data;
        console.log(`Answer sent to room: ${room}`, answer);
        socket.to(room).emit('answer', { answer, room });
      } catch (err) {
        console.error('Error handling answer:', err);
      }
    });

    // Handle ICE candidate
    socket.on('candidate', (data) => {
      try {
        const { candidate, room } = data;
        console.log(`Candidate sent to room: ${room}`, candidate);
        socket.to(room).emit('candidate', { candidate, room });
      } catch (err) {
        console.error('Error handling candidate:', err);
      }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      // Remove the user from the online users map
      for (let [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} removed from online users.`);
          break;
        }
      }
    });
  });
};
