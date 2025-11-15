const dotenv = require('dotenv');

dotenv.config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

const PORT = process.env.PORT || 3000;

// Controllers
const testJwtRouter = require('./controllers/test-jwt');
const authCtrl = require('./controllers/auth');
const usersCtrl = require('./controllers/users');
const jobsCtrl = require('./controllers/jobs');
const appCtrl = require('./controllers/application');
const chatCtrl = require('./controllers/chat');       
const reviewCtrl = require('./controllers/review'); 

// MiddleWare
const verifyToken = require('./middleware/verify-token');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Public
app.use('/auth', authCtrl);
app.use('/test-jwt', testJwtRouter);


// Protected Routes
app.use(verifyToken);
app.use('/users', usersCtrl);
app.use('/jobs', jobsCtrl);
app.use('/bids', appCtrl);
app.use('/chats', chatCtrl);   
app.use('/reviews', reviewCtrl);  


io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  socket.on('send_message', (data) => {
    const { chatId, message } = data;
    io.to(chatId).emit('receive_message', message);
  });

  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('user_typing', {
      userId: data.userId,
      username: data.username
    });
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.chatId).emit('user_stop_typing', {
      userId: data.userId
    });
  });

  socket.on('disconnect', () => {
    console.log('👋 User disconnected:', socket.id);
  });
});


app.listen(PORT, () => {
  console.log('The express app is ready!');
});
