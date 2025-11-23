/**
 * Feedback Controller - TypeScript Version
 * 
 * This controller handles feedback generation requests.
 * It uses the Feedback Agent to provide comprehensive post-interview evaluations.
 * 
 * Endpoints:
 * - POST /generate - Generate comprehensive feedback for a completed interview
 */

import { Request, Response } from 'express';
import * as agentWorkflow from '../services/agentWorkflow';
import type { GenerateFeedbackRequest } from '../types/interview.types';

/**
 * Generate comprehensive interview feedback
 * 
 * POST /api/feedback/generate
 * Body: { sessionId, quick? }
 * 
 * @param req - Express request
 * @param res - Express response
 */
export async function generateFeedback(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId, quick: _quick = false } = req.body as GenerateFeedbackRequest;

    // Validate input
    if (!sessionId) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Session ID is required',
          code: 'MISSING_SESSION_ID',
          statusCode: 400,
        },
        timestamp: Date.now(),
      });
      return;
    }

    console.log(`[CONTROLLER] Generating feedback for session: ${sessionId}`);

    // Get session to validate
    const state = agentWorkflow.getSessionState(sessionId);

    if (!state) {
      res.status(404).json({
        success: false,
        error: {
          message: 'Session not found',
          code: 'SESSION_NOT_FOUND',
          statusCode: 404,
        },
        timestamp: Date.now(),
      });
      return;
    }

    // Check if interview has any responses
    const userResponses = state.history.filter(msg => msg.from === 'user');
    if (userResponses.length === 0) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Cannot generate feedback - no responses provided. Please answer at least 3 questions.',
          code: 'NO_RESPONSES',
          statusCode: 400,
        },
        timestamp: Date.now(),
      });
      return;
    }

    // Warn if too few responses (but allow it)
    if (userResponses.length < 3) {
      console.log(`[CONTROLLER] Warning: Only ${userResponses.length} response(s) - feedback may be limited`);
    }

    // Generate feedback through Feedback Agent
    const feedback = await agentWorkflow.generateInterviewFeedback(sessionId);

    console.log('[CONTROLLER] Feedback generated successfully');

    // Clean up session after feedback
    agentWorkflow.deleteSession(sessionId);

    // Return feedback
    res.json({
      success: true,
      data: feedback,
      message: 'Feedback generated successfully',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[CONTROLLER] Error generating feedback:', error);
    res.status(500).json({
      success: false,
      error: {
        message: (error as Error).message || 'Failed to generate feedback',
        code: 'FEEDBACK_ERROR',
        statusCode: 500,
      },
      timestamp: Date.now(),
    });
  }
}

/**
 * Get available roles for feedback context
 * 
 * GET /api/feedback/roles
 * 
 * @param req - Express request
 * @param res - Express response
 */
export function getAvailableRoles(_req: Request, res: Response): void {
  const roles = [
    {
      id: 'backend',
      name: 'Backend Engineer',
      description: 'Server-side development, APIs, databases',
    },
    {
      id: 'frontend',
      name: 'Frontend Engineer',
      description: 'UI/UX, React/Vue/Angular, web applications',
    },
    {
      id: 'fullstack',
      name: 'Fullstack Engineer',
      description: 'Complete application development',
    },
    {
      id: 'sales',
      name: 'Sales Representative',
      description: 'Sales techniques and customer relationships',
    },
    {
      id: 'retail',
      name: 'Retail Associate',
      description: 'Customer service and retail operations',
    },
    {
      id: 'product_manager',
      name: 'Product Manager',
      description: 'Product strategy and stakeholder management',
    },
    {
      id: 'data_analyst',
      name: 'Data Analyst',
      description: 'Data analysis and business insights',
    },
    {
      id: 'marketing_manager',
      name: 'Marketing Manager',
      description: 'Marketing strategy and campaigns',
    },
  ];

  res.json({
    success: true,
    data: roles,
    timestamp: Date.now(),
  });
}

