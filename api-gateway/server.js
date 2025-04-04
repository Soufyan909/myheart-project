const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3006'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Service URLs
const AUTH_SERVICE_URL = `http://localhost:${process.env.AUTH_SERVICE_PORT || 3001}`;
const APPOINTMENTS_SERVICE_URL = `http://localhost:${process.env.APPOINTMENTS_SERVICE_PORT || 3002}`;
const MEDICAL_RECORDS_SERVICE_URL = `http://localhost:${process.env.MEDICAL_RECORDS_SERVICE_PORT || 3003}`;
const CHAT_SERVICE_URL = `http://localhost:${process.env.CHAT_SERVICE_PORT || 3004}`;

// Routes
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE_URL,
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
  }
}));

app.use('/api/appointments', createProxyMiddleware({
  target: APPOINTMENTS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/appointments': '/api'
  },
  onProxyReq: (proxyReq, req, res) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
}));

app.use('/api/medical-records', createProxyMiddleware({
  target: MEDICAL_RECORDS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/medical-records': '/api'
  },
  onProxyReq: (proxyReq, req, res) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
}));

app.use('/api/chat', createProxyMiddleware({
  target: CHAT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/chat': '/api'
  },
  onProxyReq: (proxyReq, req, res) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Gateway is running' });
});

const PORT = process.env.API_GATEWAY_PORT || 3005;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
}); 