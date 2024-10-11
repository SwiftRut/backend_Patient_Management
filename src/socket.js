import Chat from "./models/chatModel.js";

export default (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', ({ doctorId, patientId }) => {
      
        const room = [doctorId, patientId].sort().join('-');
        console.log(room ,"<<<<<<<<<<<<<<<<<<Room")        
        socket.join(room);
        socket.emit('joinRoom', { doctorId, patientId });
    });

    socket.on('message', async (data) => {
      console.log(data);
      const { doctorId, patientId, senderId, receiverId, messageInput:messageContent } = data;
      const chat = new Chat({ doctorId, patientId, senderId, receiverId, messageContent });
      await chat.save();

      const room = [doctorId, patientId].sort().join('-');
      io.to(room).emit('message', chat); // emit message to the room
    });


    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
};