const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3004',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Body parser middleware with increased limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Proxy middleware configuration
const authProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api/auth'
  },
  onProxyReq: (proxyReq, req, res) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error('Auth Service Proxy Error');
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const appointmentsProxy = createProxyMiddleware({
  target: process.env.APPOINTMENTS_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/appointments': '/api/appointments'
  },
  onProxyReq: (proxyReq, req, res) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error('Appointments Service Proxy Error');
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const recordsProxy = createProxyMiddleware({
  target: process.env.RECORDS_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/records': '/api/records'
  },
  onProxyReq: (proxyReq, req, res) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error('Records Service Proxy Error');
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Routes
app.use('/api/auth', authProxy);
app.use('/api/appointments', appointmentsProxy);
app.use('/api/records', recordsProxy);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Gateway is running' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
}); 