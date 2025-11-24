/**
 * Interview Routes - TypeScript Version
 * 
 * Defines all HTTP routes for interview-related operations.
 */

import { Router } from 'express';
import * as interviewController from '../controllers/interviewController';
import { apiKeyMiddleware } from '../middleware/apiKey';

const router = Router();

// Apply API key middleware to all routes
router.use(apiKeyMiddleware);

/**
 * POST /api/interview/start
 * Start a new interview session
 */
router.post('/start', interviewController.startInterview);

/**
 * POST /api/interview/next
 * Send user response and get next question (triggers multi-agent workflow)
 */
router.post('/next', interviewController.sendResponse);

/**
 * POST /api/interview/respond
 * Alias for /next - same functionality for frontend compatibility
 */
router.post('/respond', interviewController.sendResponse);

/**
 * GET /api/interview/session/:sessionId
 * Get current session information
 */
router.get('/session/:sessionId', interviewController.getSession);

/**
 * POST /api/interview/end
 * End an interview session
 */
router.post('/end', interviewController.endInterview);

export default router;

