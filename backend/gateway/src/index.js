const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Keep preflight requests out of the limit and allow normal dashboard polling.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX) || 500,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middleware
app.use(helmet()); // Set security headers
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://univento.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
})); // Enable CORS for all routes

// Apply rate limiting after CORS so browser-visible 429 responses retain CORS headers.
app.use(limiter);

// Service endpoints
const AUTH_SERVICE = process.env.AUTH_SERVICE || 'http://localhost:8001';
const EVENT_SERVICE = process.env.EVENT_SERVICE || 'http://localhost:8002';
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE || 'http://localhost:8003';
const LEADERBOARD_SERVICE = process.env.LEADERBOARD_SERVICE || 'http://localhost:8004';
const SETTINGS_SERVICE = process.env.SETTINGS_SERVICE || 'http://localhost:8005';

const createServiceProxy = (target, servicePath) => createProxyMiddleware({
  target,
  changeOrigin: true,
  pathRewrite: (path) => `${servicePath}${path}`
});

// Proxy routes
app.use('/api/auth', createServiceProxy(AUTH_SERVICE, '/api/auth'));
app.use('/api/admin', createServiceProxy(AUTH_SERVICE, '/api/admin'));
app.use('/api/events', createServiceProxy(EVENT_SERVICE, '/api/events'));
app.use('/api/notifications', createServiceProxy(NOTIFICATION_SERVICE, '/api/announcements'));
app.use('/api/leaderboard', createServiceProxy(LEADERBOARD_SERVICE, '/api/leaderboard'));
app.use('/api/settings', createServiceProxy(SETTINGS_SERVICE, '/api/settings'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API Gateway is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});