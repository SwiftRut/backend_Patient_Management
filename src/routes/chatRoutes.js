import express from "express";
import { closeChatSession, createChatSession, getChatMessages, sendMessage } from "../controllers/chatController.js";
const router = express.Router()

// create a new chat session
router.post("/creatsession" , createChatSession)


// send a message
router.post("/sendmessage/:senderId" , sendMessage)

// all chat message
router.get("/allmessage/:chatId" , getChatMessages)

// close chat session
router.put("/closesession/:chatId" , closeChatSession)
export default router