const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

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

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
// Create new appointment
app.post('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const { doctorId, date, time, type, notes } = req.body;
    const patientId = req.user.userId;

    const appointment = new Appointment({
      doctorId,
      patientId,
      date,
      time,
      type,
      notes
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
});

// Get appointments for doctor
app.get('/api/appointments/doctor', authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.userId })
      .populate('patientId', 'name email')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

// Get appointments for patient
app.get('/api/appointments/patient', authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.userId })
      .populate('doctorId', 'name email')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

// Update appointment status
app.put('/api/appointments/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify user has permission to update
    if (req.user.role === 'doctor' && appointment.doctorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    if (req.user.role === 'patient' && appointment.patientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    appointment.status = status;
    appointment.updatedAt = Date.now();
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
});

// Reschedule appointment
app.put('/api/appointments/:id/reschedule', authenticateToken, async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify user has permission to reschedule
    if (req.user.role === 'doctor' && appointment.doctorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to reschedule this appointment' });
    }

    if (req.user.role === 'patient' && appointment.patientId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to reschedule this appointment' });
    }

    appointment.date = date;
    appointment.time = time;
    appointment.status = 'rescheduled';
    appointment.updatedAt = Date.now();
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error rescheduling appointment', error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Appointments Service is running' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Appointments Service running on port ${PORT}`);
}); 