const { text } = require('express');
const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId, 
    ref:'User',
    require: true,
  },
  text: {
    type: String,
    require: true,
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
});


const chatSchema = mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages: [messageSchema],
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;