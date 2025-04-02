const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const MedicalRecord = require('./models/MedicalRecord');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3004', 'http://localhost:3005'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Body parser middleware with increased limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000, // Socket timeout
  connectTimeoutMS: 30000, // Connection timeout
  retryWrites: true,
  w: 'majority',
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  heartbeatFrequencyMS: 10000
})
.then(() => {
  console.log('Connected to MongoDB');
  // Start the server only after successful database connection
  app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Please make sure:');
  console.error('1. Your IP address is whitelisted in MongoDB Atlas');
  console.error('2. Your MongoDB Atlas cluster is running');
  console.error('3. Your connection string is correct');
  process.exit(1); // Exit the process if database connection fails
});

// Add error handler for MongoDB connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  setTimeout(() => {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      w: 'majority'
    });
  }, 5000);
});

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
// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { email, password, name, role } = req.body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      console.log('Missing required fields:', { email, name, role });
      return res.status(400).json({ 
        message: 'All fields are required',
        received: { email, name, role }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password, // Password will be hashed by the pre-save middleware
      name,
      role
    });

    console.log('Attempting to save user:', { email, name, role });
    const savedUser = await user.save();
    console.log('User saved successfully:', savedUser._id);

    // Generate token
    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email, role: savedUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log('Missing login credentials');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    console.log('Finding user with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    console.log('Checking password for user:', email);
    const isValidPassword = await user.comparePassword(password);
    console.log('Password validation result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for user:', email);

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Check if it's a MongoDB connection error
    if (error.name === 'MongoServerSelectionError') {
      return res.status(503).json({
        message: 'Database connection error. Please try again later.',
        error: 'Database service unavailable'
      });
    }

    res.status(500).json({ 
      message: 'Error logging in',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get all doctors
app.get('/api/auth/doctors', verifyToken, async (req, res) => {
  try {
    console.log('Fetching doctors. User:', req.user);
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    console.log('Found doctors:', doctors);
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
});

// Get all patients
app.get('/api/auth/patients', verifyToken, async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
});

// Verify token
app.get('/api/auth/verify', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Medical Records Routes
// Get all medical records for a patient
app.get('/api/records', verifyToken, async (req, res) => {
  try {
    console.log('Fetching medical records for user:', req.user);
    let records;
    
    if (req.user.role === 'patient') {
      records = await MedicalRecord.find({ patientId: req.user.userId });
    } else if (req.user.role === 'doctor') {
      records = await MedicalRecord.find({ doctorId: req.user.userId });
    } else {
      return res.status(403).json({ message: 'Unauthorized access to medical records' });
    }

    // Populate doctor and patient information
    const populatedRecords = await Promise.all(records.map(async (record) => {
      const doctor = await User.findById(record.doctorId).select('name email');
      const patient = await User.findById(record.patientId).select('name email');
      return {
        ...record.toObject(),
        doctor,
        patient
      };
    }));

    res.json(populatedRecords);
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ message: 'Error fetching medical records', error: error.message });
  }
});

// Get a specific medical record
app.get('/api/records/:id', verifyToken, async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({
      _id: req.params.id,
      $or: [
        { patientId: req.user.userId },
        { doctorId: req.user.userId }
      ]
    });

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Populate doctor and patient information
    const doctor = await User.findById(record.doctorId).select('name email');
    const patient = await User.findById(record.patientId).select('name email');

    res.json({
      ...record.toObject(),
      doctor,
      patient
    });
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({ message: 'Error fetching medical record', error: error.message });
  }
});

// Create a new medical record
app.post('/api/records', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create medical records' });
    }

    const record = new MedicalRecord({
      ...req.body,
      doctorId: req.user.userId
    });

    await record.save();
    res.status(201).json(record);
  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({ message: 'Error creating medical record', error: error.message });
  }
});

// Update a medical record
app.put('/api/records/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can update medical records' });
    }

    const record = await MedicalRecord.findOneAndUpdate(
      {
        _id: req.params.id,
        doctorId: req.user.userId
      },
      req.body,
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.json(record);
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({ message: 'Error updating medical record', error: error.message });
  }
});

// Delete a medical record
app.delete('/api/records/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can delete medical records' });
    }

    const record = await MedicalRecord.findOneAndDelete({
      _id: req.params.id,
      doctorId: req.user.userId
    });

    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({ message: 'Error deleting medical record', error: error.message });
  }
});

// Update user profile
app.put('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      name,
      phone,
      dateOfBirth,
      emailNotifications,
      smsNotifications
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (emailNotifications !== undefined) user.emailNotifications = emailNotifications;
    if (smsNotifications !== undefined) user.smsNotifications = smsNotifications;

    await user.save();

    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      emailNotifications: user.emailNotifications,
      smsNotifications: user.smsNotifications
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Auth Service is running' });
}); 