import chatModel from "../models/chatModel.js";

export const createChatSession = async (req, res) => {
    const { doctorId, patientId } = req.body;
  
    try {
      const newChat = new chatModel({
        participants: [doctorId, patientId],
      });
  
      await newChat.save();
      res.status(201).json({ message: "Chat session created successfully", chat: newChat });
    } catch (error) {
      res.status(500).json({ message: "Failed to create chat session", error });
    }
  };

  export const sendMessage = async (req, res) => {
    const { chatId, message } = req.body;
    let {senderId} = req.params
  
    try {
      const chat = await chatModel.findById(chatId);
  
      if (!chat) {
        return res.status(404).json({ message: "Chat session not found" });
      }
  
      chat.messages.push({ sender: senderId, message });
  
      await chat.save();
      res.status(200).json({ message: "Message sent", chat });
    } catch (error) {
      res.status(500).json({ message: "Failed to send message", error });
    }
  };


  export const getChatMessages = async (req, res) => {
    const { chatId } = req.params;
  
    try {
      const chat = await chatModel.findById(chatId).populate("messages" , "sender");
  
      if (!chat) {
        return res.status(404).json({ message: "Chat session not found" });
      }
  
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve messages", error });
    }
  };

  export const closeChatSession = async (req, res) => {
    const { chatId } = req.params;
  
    try {
      const chat = await chatModel.findById(chatId);
  
      if (!chat) {
        return res.status(404).json({ message: "Chat session not found" });
      }
  
      chat.sessionStatus = "completed";
      await chat.save();
  
      res.status(200).json({ message: "Chat session closed", chat });
    } catch (error) {
      res.status(500).json({ message: "Failed to close chat session", error });
    }
  };