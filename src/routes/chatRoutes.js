import express from 'express';
import chatModel from '../models/chatModel.js';

const router = express.Router();

// Get all chats for a user
router.get('/user', async (req, res) => {
    try {
      const chats = await chatModel.find({ 'participants.user': req.params.userId }).populate('participants.user');
      res.json(chats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Get a specific chat
router.get('/:chatId',  async (req, res) => {
    try {
      const { userId1, userId2 } = req.body;
      let chat = await chatModel.findOne({ 
        'participants.user': { $all: [userId1, userId2] }
      });
  
      if (!chat) {
        chat = new chatModel({
          participants: [{ user: userId1 }, { user: userId2 }],
        });
        await chat.save();
      }
  
      res.status(201).json(chat);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// Create a new chat
router.post('/create', async (req, res) => {
    try {
      const { userId1, userId2 } = req.body;
      let chat = await chatModel.findOne({ 
        'participants.user': { $all: [userId1, userId2] }
      });
  
      if (!chat) {
        chat = new chatModel({
          participants: [{ user: userId1 }, { user: userId2 }],
        });
        await chat.save();
      }
  
      res.status(201).json({chat, message: "Chat created successfully"});
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

export default router;