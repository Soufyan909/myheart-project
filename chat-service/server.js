const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Chat Message Schema
const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  fileUrl: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.user = decoded;
    next();
  });
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.userId}`);

  // Join user's personal room
  socket.join(socket.user.userId);

  // Handle new message
  socket.on('send_message', async (data) => {
    try {
      const { receiverId, content, type, fileUrl } = data;
      
      // Create new message
      const message = new Message({
        senderId: socket.user.userId,
        receiverId,
        content,
        type,
        fileUrl
      });

      await message.save();

      // Emit message to receiver
      io.to(receiverId).emit('receive_message', {
        messageId: message._id,
        senderId: socket.user.userId,
        content,
        type,
        fileUrl,
        createdAt: message.createdAt
      });

      // Emit confirmation to sender
      socket.emit('message_sent', {
        messageId: message._id,
        receiverId,
        content,
        type,
        fileUrl,
        createdAt: message.createdAt
      });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Error sending message' });
    }
  });

  // Handle message read status
  socket.on('mark_read', async (messageId) => {
    try {
      const message = await Message.findById(messageId);
      if (message && message.receiverId.toString() === socket.user.userId) {
        message.read = true;
        await message.save();

        // Notify sender that message was read
        io.to(message.senderId.toString()).emit('message_read', {
          messageId,
          readAt: Date.now()
        });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      socket.emit('error', { message: 'Error marking message as read' });
    }
  });

  // Handle typing status
  socket.on('typing', (data) => {
    const { receiverId, isTyping } = data;
    io.to(receiverId).emit('user_typing', {
      userId: socket.user.userId,
      isTyping
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.userId}`);
  });
});

// REST API Routes
// Get chat history
app.get('/api/chat/history/:userId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.userId },
        { receiverId: req.params.userId }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('senderId', 'name email')
    .populate('receiverId', 'name email');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history', error: error.message });
  }
});

// Get unread messages count
app.get('/api/chat/unread/:userId', async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.params.userId,
      read: false
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Chat Service is running' });
});

const PORT = process.env.PORT || 3004;
server.listen(PORT, () => {
  console.log(`Chat Service running on port ${PORT}`);
}); 