/**
 * Feedback Routes - TypeScript Version
 * 
 * Defines all HTTP routes for feedback-related operations.
 */

import { Router } from 'express';
import * as feedbackController from '../controllers/feedbackController';
import { apiKeyMiddleware } from '../middleware/apiKey';

const router = Router();

/**
 * POST /api/feedback/generate
 * Generate comprehensive feedback for a completed interview
 */
router.post('/generate', apiKeyMiddleware, feedbackController.generateFeedback);

/**
 * GET /api/feedback/roles
 * Get available roles for feedback context
 */
router.get('/roles', feedbackController.getAvailableRoles);

export default router;

