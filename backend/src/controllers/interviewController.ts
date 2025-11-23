/**
 * Interview Controller - TypeScript Version with Multi-Agent System
 * 
 * This controller handles all interview-related HTTP requests and
 * coordinates with the multi-agent workflow service.
 * 
 * Endpoints:
 * - POST /start - Start a new interview session
 * - POST /next - Send user response and get next question
 * - GET /session/:id - Get session information
 * - POST /end - End an interview session
 */

import { Request, Response } from 'express';
import * as agentWorkflow from '../services/agentWorkflow';
import type { 
  StartInterviewRequest, 
  SendResponseRequest 
} from '../types/interview.types';

/**
 * Start a new interview session
 * 
 * POST /api/interview/start
 * Body: { role, seniority?, interactionMode? }
 * 
 * @param req - Express request
 * @param res - Express response
 */
export async function startInterview(req: Request, res: Response): Promise<void> {
  try {
    const { role, seniority = 'mid', interactionMode = 'chat' } = req.body as StartInterviewRequest;

    // Validate input
    if (!role) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Role is required',
          code: 'MISSING_ROLE',
          statusCode: 400,
        },
        timestamp: Date.now(),
      });
      return;
    }

    // Validate role
    const validRoles = [
      'backend',
      'frontend',
      'fullstack',
      'sales',
      'retail',
      'product_manager',
      'data_analyst',
      'marketing_manager',
    ];

    if (!validRoles.includes(role)) {
      res.status(400).json({
        success: false,
        error: {
          message: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
          code: 'INVALID_ROLE',
          statusCode: 400,
        },
        timestamp: Date.now(),
      });
      return;
    }

    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`[CONTROLLER] Starting interview: ${sessionId}, role: ${role}, seniority: ${seniority}`);

    // Initialize interview through agent workflow
    const { state, message } = await agentWorkflow.initializeInterviewSession(
      sessionId,
      role,
      seniority,
      interactionMode
    );

    // Return success response
    res.json({
      success: true,
      data: {
        sessionId: state.sessionId,
        role: state.role,
        seniority: state.seniority,
        message,
        phase: state.status,
      },
      message: 'Interview started successfully',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[CONTROLLER] Error starting interview:', error);
    res.status(500).json({
      success: false,
      error: {
        message: (error as Error).message || 'Failed to start interview',
        code: 'INTERVIEW_START_ERROR',
        statusCode: 500,
      },
      timestamp: Date.now(),
    });
  }
}

/**
 * Process user response and get next question
 * 
 * POST /api/interview/next
 * Body: { sessionId, message }
 * 
 * This triggers the multi-agent workflow:
 * User Answer → Analyzer → Orchestrator → Interviewer/Feedback
 * 
 * @param req - Express request
 * @param res - Express response
 */
export async function sendResponse(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId, message } = req.body as SendResponseRequest;

    // Validate input
    if (!sessionId || !message) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Session ID and message are required',
          code: 'MISSING_FIELDS',
          statusCode: 400,
        },
        timestamp: Date.now(),
      });
      return;
    }

    // Sanitize message
    const sanitizedMessage = message.trim();
    if (!sanitizedMessage) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Message cannot be empty',
          code: 'EMPTY_MESSAGE',
          statusCode: 400,
        },
        timestamp: Date.now(),
      });
      return;
    }

    console.log(`[CONTROLLER] Processing response for session: ${sessionId}`);

    // Process through agent workflow
    const result = await agentWorkflow.processUserResponse(sessionId, sanitizedMessage);

    // Return response
    res.json({
      success: true,
      data: {
        sessionId,
        message: result.message,
        phase: result.phase,
        questionCount: result.questionCount,
        shouldEnd: result.shouldEnd,
        analytics: result.analytics,
      },
      message: 'Response processed successfully',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[CONTROLLER] Error processing response:', error);
    
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage.includes('Session not found') ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      error: {
        message: errorMessage || 'Failed to process response',
        code: statusCode === 404 ? 'SESSION_NOT_FOUND' : 'PROCESSING_ERROR',
        statusCode,
      },
      timestamp: Date.now(),
    });
  }
}

/**
 * Get current session information
 * 
 * GET /api/interview/session/:sessionId
 * 
 * @param req - Express request
 * @param res - Express response
 */
export async function getSession(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.params;

    console.log(`[CONTROLLER] Getting session: ${sessionId}`);

    const state = agentWorkflow.getSessionState(sessionId || '');

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

    // Return safe session data (don't expose full conversation)
    res.json({
      success: true,
      data: {
        sessionId: state.sessionId,
        role: state.role,
        seniority: state.seniority,
        questionCount: state.questionCount,
        phase: state.status,
        interactionMode: state.interactionMode,
        startTime: state.startTime,
        endTime: state.endTime,
        analytics: {
          avgAnswerLength: state.analytics.avgAnswerLength,
          communicationScore: state.analytics.communicationScore,
          technicalScore: state.analytics.technicalScore,
        },
      },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[CONTROLLER] Error getting session:', error);
    res.status(500).json({
      success: false,
      error: {
        message: (error as Error).message || 'Failed to get session',
        code: 'SESSION_ERROR',
        statusCode: 500,
      },
      timestamp: Date.now(),
    });
  }
}

/**
 * End an interview session
 * 
 * POST /api/interview/end
 * Body: { sessionId }
 * 
 * @param req - Express request
 * @param res - Express response
 */
export async function endInterview(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.body;

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

    console.log(`[CONTROLLER] Ending interview: ${sessionId}`);

    agentWorkflow.endInterviewSession(sessionId);

    res.json({
      success: true,
      data: { sessionId, phase: 'ended' },
      message: 'Interview ended successfully',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[CONTROLLER] Error ending interview:', error);
    res.status(500).json({
      success: false,
      error: {
        message: (error as Error).message || 'Failed to end interview',
        code: 'END_INTERVIEW_ERROR',
        statusCode: 500,
      },
      timestamp: Date.now(),
    });
  }
}

