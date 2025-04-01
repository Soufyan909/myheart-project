const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const Appointment = require('./models/Appointment');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: 'http://localhost:3004',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medical-appointments', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes
// Get all appointments for a user
app.get('/api/appointments', verifyToken, async (req, res) => {
  try {
    console.log('Fetching appointments for user:', req.user.userId);
    const appointments = await Appointment.find({
      $or: [
        { patientId: req.user.userId },
        { doctorId: req.user.userId }
      ]
    });
    console.log('Found appointments:', appointments);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

// Create new appointment
app.post('/api/appointments', verifyToken, async (req, res) => {
  try {
    console.log('Received appointment creation request:', req.body);
    const { doctorId, patientId, dateTime, reason, status } = req.body;
    
    // Parse the dateTime string into a Date object
    const appointmentDate = new Date(dateTime);
    
    const appointment = new Appointment({
      patientId: patientId || req.user.userId,
      doctorId,
      date: appointmentDate,
      time: appointmentDate.toLocaleTimeString(),
      type: 'consultation',
      notes: reason,
      status: 'scheduled' // Set initial status to 'scheduled'
    });

    console.log('Creating appointment:', appointment);
    await appointment.save();
    console.log('Appointment saved successfully:', appointment);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
});

// Update appointment
app.put('/api/appointments/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const appointment = await Appointment.findOne({
      _id: id,
      $or: [
        { patientId: req.user.userId },
        { doctorId: req.user.userId }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status || appointment.status;
    appointment.notes = notes || appointment.notes;

    await appointment.save();
    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
});

// Delete appointment
app.delete('/api/appointments/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findOneAndDelete({
      _id: id,
      patientId: req.user.userId
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Appointments Service is running' });
});

app.listen(PORT, () => {
  console.log(`Appointments Service running on port ${PORT}`);
}); 