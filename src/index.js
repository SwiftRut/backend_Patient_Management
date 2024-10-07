import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { app } from "./app.js";
import socketHandler from "./socket.js";
dotenv.config({ path: "./.env" });

import http from "http";
import { Server } from 'socket.io';

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});
io.on('connection', (socket) => {
  console.log('a user connected');
});

socketHandler(io);
connectDB()
  .then(() => {
    server.listen(port, () => console.log(`Listening on port ${port}`));
  })
  .catch((error) => {
    console.log("MONGODB connection failed", error);
  });
