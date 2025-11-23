// Main Server File
// Express server setup with all routes and middleware

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');
const { simpleRateLimit } = require('./src/middleware/validation');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 9000;

// =====================
// MIDDLEWARE
// =====================

// Enable CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple rate limiting
app.use(simpleRateLimit(100, 60000)); // 100 requests per minute

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// =====================
// ROUTES
// =====================

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Interview Practice Partner API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/interview', require('./src/routes/interview'));
app.use('/api/feedback', require('./src/routes/feedback'));
app.use('/api/voice', require('./src/routes/voice'));

// =====================
// ERROR HANDLING
// =====================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// =====================
// START SERVER
// =====================

const server = app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 Interview Practice Partner API');
  console.log('=================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('=================================');
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('\n❌ Error: Port', PORT, 'is already in use.');
    console.error('\nTo fix this, you can:');
    console.error('1. Kill the process using port', PORT + ':');
    console.error(`   lsof -ti:${PORT} | xargs kill -9`);
    console.error('   or on Windows:');
    console.error(`   netstat -ano | findstr :${PORT}`);
    console.error('2. Use a different port by setting PORT environment variable:');
    console.error(`   PORT=9001 npm start`);
    console.error('\n');
    process.exit(1);
  } else {
    console.error('Server error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down...');
  process.exit(0);
});

module.exports = app;

