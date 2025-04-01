const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true
  },
  doctorId: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true
  },
  prescription: {
    type: String,
    trim: true
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  treatment: {
    type: String,
    trim: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  nextVisitDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema); 