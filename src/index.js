import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";
import socketHandler from "./socket.js";
import logger from "./config/logger.js";
dotenv.config({ path: "./.env" });

import http from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  logger.info(`User connected: ${socket.id}`);
});

io.on("connection", (socket) => {
  logger.info("User connected:", socket.id);

  // Join room for specific chat session
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    logger.info(`User joined chat: ${chatId}`);
  });

  // Listen for new messages
  socket.on("sendMessage", (data) => {
    const { chatId, message } = data;
    io.to(chatId).emit("receiveMessage", message); // Broadcast to room
  });

  socket.on("disconnect", () => {
    logger.info("User disconnected");
  });
});

socketHandler(io);
connectDB()
  .then(() => {
    server.listen(port, () => logger.info(`Server is running on port ${port}`));
  })
  .catch((error) => {
    logger.error("MONGODB connection failed:", error);
  });
