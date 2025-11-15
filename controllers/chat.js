const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({
      participants: userId
    })
    .populate('participants', 'username email role')
    .populate('messages.sender', 'username')
    .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
