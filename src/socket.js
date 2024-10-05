export default (io) => {
    io.on('connection', (socket) => {
      console.log('A user connected: ' + socket.id);
  
      socket.on('chatMessage', ({ username, msg }) => {
        console.log('Message from client:', msg);
        io.emit('chatMessage', { username, msg });
      });
  
      socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
      });
    });
  };