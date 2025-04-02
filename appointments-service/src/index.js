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

// Connect to MongoDB with enhanced error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medical-appointments', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Successfully connected to MongoDB');
  console.log('Database:', mongoose.connection.db.databaseName);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Connection string used:', process.env.MONGODB_URI || 'mongodb://localhost:27017/medical-appointments');
  console.error('Full error details:', {
    name: err.name,
    message: err.message,
    stack: err.stack
  });
});

// Add MongoDB connection error handler
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Add MongoDB disconnection handler
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Add MongoDB reconnection handler
mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  console.log('Headers received:', req.headers);
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);
  
  const token = authHeader?.split(' ')[1];
  console.log('Extracted token:', token);
  
  if (!token) {
    console.log('No token provided in request');
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    console.log('Attempting to verify token with secret:', JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

// Routes
// Get all appointments for a user
app.get('/api/appointments', verifyToken, async (req, res) => {
  try {
    console.log('Received request for appointments');
    console.log('User from token:', req.user);
    
    const appointments = await Appointment.find({
      $or: [
        { patientId: req.user.userId },
        { doctorId: req.user.userId }
      ]
    });
    
    console.log('Found appointments:', appointments);
    console.log('Number of appointments:', appointments.length);
    
    res.json(appointments);
  } catch (error) {
    console.error('Error in /api/appointments:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      message: 'Error fetching appointments',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Create new appointment
app.post('/api/appointments', verifyToken, async (req, res) => {
  try {
    console.log('Received appointment creation request:', req.body);
    const { doctorId, dateTime, reason, type } = req.body;
    
    // Parse the dateTime string into a Date object
    const appointmentDate = new Date(dateTime);
    
    const appointment = new Appointment({
      patientId: req.user.userId,
      doctorId,
      date: appointmentDate,
      time: appointmentDate.toLocaleTimeString(),
      type: type || 'consultation',
      notes: reason,
      status: 'scheduled'
    });

    console.log('Creating appointment:', appointment);
    const savedAppointment = await appointment.save();
    console.log('Appointment saved successfully:', savedAppointment);
    
    // Return a more detailed response
    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: savedAppointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ 
      message: 'Error creating appointment', 
      error: error.message 
    });
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

// Cancel appointment
app.put('/appointments/:id/cancel', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if the user has permission to cancel this appointment
    if (appointment.patientId.toString() !== req.user.userId && 
        appointment.doctorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    // Check if appointment is already cancelled
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    // Check if appointment is in the past
    if (new Date(appointment.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot cancel past appointments' });
    }

    appointment.status = 'cancelled';
    appointment.cancelReason = reason;
    appointment.cancelledAt = new Date();
    appointment.cancelledBy = req.user.userId;

    await appointment.save();

    // Return the updated appointment
    res.json({
      message: 'Appointment cancelled successfully',
      appointment: {
        id: appointment._id,
        status: appointment.status,
        cancelReason: appointment.cancelReason,
        cancelledAt: appointment.cancelledAt,
        cancelledBy: appointment.cancelledBy
      }
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Error cancelling appointment' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Appointments Service is running' });
});

app.listen(PORT, () => {
  console.log(`Appointments Service running on port ${PORT}`);
}); 