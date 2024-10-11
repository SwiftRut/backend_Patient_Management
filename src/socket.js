import Chat from "./models/chatModel.js";

export default (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', ({ doctorId, patientId }) => {
      const room = [doctorId, patientId].sort().join('-');
      console.log(room, '<<<<<<<<<<<<<<<<<<Room');
      socket.join(room);
      socket.emit('joinRoom', { doctorId, patientId });
    });
  //   socket.on("joinRoom", ({ room, name }) => {
  //     socket.join(room);
  //     console.log(`${name} has joined the room: ${room}`);
  //     socket.to(room).emit("userJoined", { name }); // Notify others in the room
  // });
    socket.on('message', async (data) => {
      console.log(data);
      const { doctorId, patientId, senderId, receiverId, messageContent } = data;
      const chat = new Chat({ doctorId, patientId, senderId, receiverId, messageContent });
      await chat.save();

      const room = [doctorId, patientId].sort().join('-');
      io.to(room).emit('message', chat); // emit message to the room
    });

    socket.on('offer', async (data) => {
      const { offer, room } = data;
      console.log(`Offer sent to room: ${room}`, offer);
      socket.to(room).emit('offer', { offer, room });
    });

    socket.on('answer', (data) => {
      const { answer, room } = data;
      console.log(`Answer sent to room: ${room}`, answer);
      socket.to(room).emit('answer', { answer, room });
    });

    socket.on('candidate', (data) => {
      const { candidate, room } = data;
      console.log(`Candidate sent to room: ${room}`, candidate);
      socket.to(room).emit('candidate', { candidate, room });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};