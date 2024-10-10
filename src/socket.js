import chatModel from "./models/chatModel.js";

export default (io) => {
  io.on('connection', (socket) => {
    socket.on('join', (chatId) => socket.join(chatId));

    socket.on('chatMessage', async ({ chatId, senderId, content }) => {
      const newMessage = { sender: senderId, content };
      // const chat = await chatModel.findByIdAndUpdate(chatId, {
      //   $push: { messages: newMessage },
      // });
      console.log(chatId, senderId, content);
      io.emit('newMessage', { chatId, newMessage });
    });
  });
};