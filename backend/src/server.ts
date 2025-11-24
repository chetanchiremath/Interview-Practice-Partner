/**
 * Main Server File - TypeScript Multi-Agent Interview System
 * 
 * This is the entry point for the backend server.
 * It sets up Express with all routes, middleware, and configuration
 * for the agentic multi-agent interview platform.
 * 
 * Architecture:
 * - Multi-agent system: Orchestrator, Analyzer, Interviewer, Feedback
 * - Voice I/O: OpenAI Whisper (STT) and OpenAI TTS
 * - LangChain for agent orchestration
 * - TypeScript for type safety
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import interviewRoutes from './routes/interview';
import feedbackRoutes from './routes/feedback';
import voiceRoutes from './routes/voice';

// Load environment variables
dotenv.config();

// Validate required environment variables
// Note: GEMINI_API_KEY is now optional since users can provide their own via headers
const requiredEnvVars: string[] = [];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`\n❌ Error: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Warn if no default API key is set (optional)
if (!process.env.GEMINI_API_KEY) {
  console.warn('\n⚠️  Warning: No GEMINI_API_KEY found in environment variables.');
  console.warn('Users will need to provide their own API keys via the frontend.\n');
}

// Create Express app
const app = express();
const PORT = process.env.PORT || 9000;

// =====================
// MIDDLEWARE
// =====================

/**
 * CORS Configuration
 * Allows frontend to communicate with backend
 */
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
  credentials: true,
}));

/**
 * Body Parsers
 * Parse JSON and URL-encoded request bodies
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request Logging Middleware
 * Logs all incoming requests for debugging
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

/**
 * Simple Rate Limiting
 * Prevents API abuse
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

app.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const limit = 100; // requests
  const window = 60000; // 1 minute

  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + window });
    next();
  } else if (record.count < limit) {
    record.count++;
    next();
  } else {
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        statusCode: 429,
      },
      timestamp: Date.now(),
    });
  }
});

// =====================
// ROUTES
// =====================

/**
 * Health Check Endpoint
 * Used to verify the server is running
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Multi-Agent Interview Practice Partner API is running',
    version: '2.0.0',
    architecture: 'Multi-Agent (Orchestrator, Analyzer, Interviewer, Feedback)',
    features: ['Voice I/O', 'Adaptive Questioning', 'Real-time Analytics', 'Comprehensive Feedback'],
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */
app.use('/api/interview', interviewRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/voice', voiceRoutes);

// =====================
// ERROR HANDLING
// =====================

/**
 * 404 Handler
 * Catches requests to undefined routes
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.path}`,
      code: 'NOT_FOUND',
      statusCode: 404,
    },
    timestamp: Date.now(),
  });
});

/**
 * Global Error Handler
 * Catches all unhandled errors
 */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    },
    timestamp: Date.now(),
  });
});

// =====================
// START SERVER
// =====================

// Only start the server if we're not in a serverless environment (like Vercel)
// Vercel exports the app and handles the server itself
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const server = app.listen(PORT, () => {

    console.log('\n==============================================');
    console.log('🚀 Multi-Agent Interview Practice Partner API');
    console.log('==============================================');
    console.log(`Server:      http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health:      http://localhost:${PORT}/health`);
    console.log('\n📋 Available Endpoints:');
    console.log('  POST   /api/interview/start     - Start new interview');
    console.log('  POST   /api/interview/next      - Send response (triggers agents)');
    console.log('  GET    /api/interview/session/:id - Get session info');
    console.log('  POST   /api/interview/end       - End interview');
    console.log('  POST   /api/feedback/generate   - Generate feedback');
    console.log('  GET    /api/feedback/roles      - Get available roles');
    console.log('  POST   /api/voice/stt           - Speech to text');
    console.log('  POST   /api/voice/tts           - Text to speech');
    console.log('  POST   /api/voice/tts-stream    - Text to speech (streaming)');
    console.log('  GET    /api/voice/voices        - Get TTS voices');
    console.log('\n🤖 Agent Architecture:');
    console.log('  1. Orchestrator → Decides what happens next');
    console.log('  2. Analyzer     → Evaluates user responses');
    console.log('  3. Interviewer  → Generates questions');
    console.log('  4. Feedback     → Provides final evaluation');
    console.log('\n==============================================\n');
  });

  /**
   * Handle server errors
   */
  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`\n❌ Error: Port ${PORT} is already in use.`);
      console.error('\nTo fix this:');
      console.error(`1. Kill the process: lsof -ti:${PORT} | xargs kill -9`);
      console.error(`2. Or use a different port: PORT=9001 npm run dev\n`);
      process.exit(1);
    } else {
      console.error('Server error:', error);
      process.exit(1);
    }
  });

  /**
   * Graceful Shutdown
   * Handles Ctrl+C and other termination signals
   */
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Gracefully shutting down...');
    server.close(() => {
      console.log('Server closed. Goodbye!\n');
      process.exit(0);
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught exception:', error);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: any) => {
    console.error('Unhandled rejection:', reason);
    process.exit(1);
  });
}

export default app;

