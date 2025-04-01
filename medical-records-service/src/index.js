const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type. Only JPEG, PNG, PDF, and DOC files are allowed.'));
  },
});

// Medical Record Schema
const medicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diagnosis: { type: String, required: true },
  symptoms: [String],
  treatment: String,
  prescription: String,
  notes: String,
  attachments: [{
    filename: String,
    path: String,
    uploadDate: { type: Date, default: Date.now },
  }],
  date: { type: Date, default: Date.now },
  followUpDate: Date,
  status: {
    type: String,
    enum: ['active', 'completed', 'requires_follow_up'],
    default: 'active',
  },
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes

// Create Medical Record
app.post('/medical-records', verifyToken, upload.array('attachments', 5), async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create medical records' });
    }

    const {
      patientId,
      diagnosis,
      symptoms,
      treatment,
      prescription,
      notes,
      followUpDate,
    } = req.body;

    const attachments = req.files?.map(file => ({
      filename: file.originalname,
      path: file.path,
    })) || [];

    const medicalRecord = new MedicalRecord({
      patientId,
      doctorId: req.user.id,
      diagnosis,
      symptoms: symptoms ? JSON.parse(symptoms) : [],
      treatment,
      prescription,
      notes,
      attachments,
      followUpDate,
    });

    await medicalRecord.save();
    res.status(201).json(medicalRecord);
  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({ message: 'Error creating medical record' });
  }
});

// Get Medical Records (filtered by user role)
app.get('/medical-records', verifyToken, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'doctor') {
      query.doctorId = req.user.id;
    } else if (req.user.role === 'patient') {
      query.patientId = req.user.id;
    }

    const records = await MedicalRecord.find(query)
      .populate('doctorId', 'name')
      .populate('patientId', 'name')
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ message: 'Error fetching medical records' });
  }
});

// Get Single Medical Record
app.get('/medical-records/:id', verifyToken, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('doctorId', 'name')
      .populate('patientId', 'name');

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Check if user has permission to view
    if (
      record.patientId._id.toString() !== req.user.id &&
      record.doctorId._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(record);
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({ message: 'Error fetching medical record' });
  }
});

// Update Medical Record
app.put('/medical-records/:id', verifyToken, upload.array('attachments', 5), async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can update medical records' });
    }

    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    if (record.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const {
      diagnosis,
      symptoms,
      treatment,
      prescription,
      notes,
      followUpDate,
      status,
    } = req.body;

    const newAttachments = req.files?.map(file => ({
      filename: file.originalname,
      path: file.path,
    })) || [];

    record.diagnosis = diagnosis || record.diagnosis;
    record.symptoms = symptoms ? JSON.parse(symptoms) : record.symptoms;
    record.treatment = treatment || record.treatment;
    record.prescription = prescription || record.prescription;
    record.notes = notes || record.notes;
    record.followUpDate = followUpDate || record.followUpDate;
    record.status = status || record.status;
    record.attachments = [...record.attachments, ...newAttachments];

    await record.save();
    res.json(record);
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({ message: 'Error updating medical record' });
  }
});

// Delete Medical Record
app.delete('/medical-records/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    if (req.user.role === 'doctor' && record.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await record.remove();
    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({ message: 'Error deleting medical record' });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'medical-records-service' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Medical Records service running on port ${PORT}`);
}); 