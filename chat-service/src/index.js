const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3004', 'http://localhost:3005'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Message Schema
const messageSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// REST API Routes
app.get('/api/messages/:appointmentId', async (req, res) => {
  try {
    const messages = await Message.find({ appointmentId: req.params.appointmentId })
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join appointment room
  socket.on('join-appointment', (appointmentId) => {
    socket.join(appointmentId);
    console.log(`User ${socket.id} joined appointment ${appointmentId}`);
  });

  // Handle new message
  socket.on('message', async (messageData) => {
    try {
      const message = new Message(messageData);
      await message.save();

      // Emit message to room
      io.to(messageData.appointmentId).emit('message', message);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Chat service running on port ${PORT}`);
}); 