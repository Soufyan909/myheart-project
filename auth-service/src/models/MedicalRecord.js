const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    ref: 'User'
  },
  doctorId: {
    type: String,
    required: true,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  diagnosis: {
    type: String,
    required: true
  },
  prescription: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: true,
    enum: ['consultation', 'follow-up', 'test-results', 'prescription']
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema); 