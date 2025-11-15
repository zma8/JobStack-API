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

router.post('/',async(req,res)=>{
    try {
        const { freelancerId, clientId } = req.body;
        const existingChat = await Chat.findOne({
        participants: { $all: [freelancerId, clientId] }
    });

    if (existingChat) {
      return res.json(existingChat);
    }

     const newChat = await Chat.create({
      participants: [freelancerId, clientId],
      messages: []
    });

     await newChat.populate('participants', 'username email role');
    
     res.status(201).json(newChat);
    } catch (error) {
          console.error(err);
         res.status(500).json({ error: err.message });  
    }
});

router.get('/;chatId/messages',async (req,res)=>{
   try{
    const{chatId}=req.params;

    const chat=await Chat.findById(chatId).populate('messages.sender','username');

    if(!chat){
        return res.status(404).json({error:'Chat not found'});
    }

    res.json(chat.messages);

   }catch{
     console.error(err);
    res.status(500).json({ error: err.message });  
   }
});

router.post('/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { senderId, text } = req.body;

    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const newMessage = {
      sender: senderId,
      text,
      createdAt: new Date()
    };

    chat.messages.push(newMessage);
    await chat.save();

    await chat.populate('messages.sender', 'username');
    const savedMessage = chat.messages[chat.messages.length - 1];

    res.status(201).json(savedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;