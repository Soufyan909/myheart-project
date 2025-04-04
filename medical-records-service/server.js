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

// Medical Record Schema
const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diagnosis: { type: String, required: true },
  prescription: { type: String, required: true },
  notes: String,
  testResults: [{
    testName: String,
    result: String,
    date: Date
  }],
  vitals: [{
    type: String,
    value: String,
    date: Date
  }],
  attachments: [{
    name: String,
    url: String,
    type: String,
    date: Date
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

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
// Create new medical record
app.post('/api/medical-records', authenticateToken, async (req, res) => {
  try {
    const { patientId, diagnosis, prescription, notes, testResults, vitals, attachments } = req.body;

    // Verify user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create medical records' });
    }

    const medicalRecord = new MedicalRecord({
      patientId,
      doctorId: req.user.userId,
      diagnosis,
      prescription,
      notes,
      testResults,
      vitals,
      attachments
    });

    await medicalRecord.save();
    res.status(201).json(medicalRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error creating medical record', error: error.message });
  }
});

// Get medical records for patient
app.get('/api/medical-records/patient', authenticateToken, async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find({ patientId: req.user.userId })
      .populate('doctorId', 'name email')
      .sort({ createdAt: -1 });
    res.json(medicalRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medical records', error: error.message });
  }
});

// Get medical records for doctor
app.get('/api/medical-records/doctor', authenticateToken, async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find({ doctorId: req.user.userId })
      .populate('patientId', 'name email')
      .sort({ createdAt: -1 });
    res.json(medicalRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medical records', error: error.message });
  }
});

// Update medical record
app.put('/api/medical-records/:id', authenticateToken, async (req, res) => {
  try {
    const { diagnosis, prescription, notes, testResults, vitals, attachments } = req.body;
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Verify user is the doctor who created the record
    if (medicalRecord.doctorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this medical record' });
    }

    medicalRecord.diagnosis = diagnosis || medicalRecord.diagnosis;
    medicalRecord.prescription = prescription || medicalRecord.prescription;
    medicalRecord.notes = notes || medicalRecord.notes;
    medicalRecord.testResults = testResults || medicalRecord.testResults;
    medicalRecord.vitals = vitals || medicalRecord.vitals;
    medicalRecord.attachments = attachments || medicalRecord.attachments;
    medicalRecord.updatedAt = Date.now();

    await medicalRecord.save();
    res.json(medicalRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error updating medical record', error: error.message });
  }
});

// Add test results
app.post('/api/medical-records/:id/test-results', authenticateToken, async (req, res) => {
  try {
    const { testName, result } = req.body;
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Verify user is the doctor who created the record
    if (medicalRecord.doctorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this medical record' });
    }

    medicalRecord.testResults.push({
      testName,
      result,
      date: Date.now()
    });

    await medicalRecord.save();
    res.json(medicalRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error adding test results', error: error.message });
  }
});

// Add vitals
app.post('/api/medical-records/:id/vitals', authenticateToken, async (req, res) => {
  try {
    const { type, value } = req.body;
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Verify user is the doctor who created the record
    if (medicalRecord.doctorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this medical record' });
    }

    medicalRecord.vitals.push({
      type,
      value,
      date: Date.now()
    });

    await medicalRecord.save();
    res.json(medicalRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error adding vitals', error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Medical Records Service is running' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Medical Records Service running on port ${PORT}`);
}); 