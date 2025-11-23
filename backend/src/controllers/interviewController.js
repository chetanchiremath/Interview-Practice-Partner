// Interview Controller - Handles interview-related requests
// This is the main controller that orchestrates the interview flow

const aiService = require('../services/aiService');
const { 
  generateSessionId, 
  sanitizeInput, 
  isValidRole,
  createSuccessResponse,
  createErrorResponse 
} = require('../utils/helpers');

/**
 * Start a new interview session
 * POST /api/interview/start
 * Body: { role: string, interactionMode: 'voice' | 'chat' }
 */
async function startInterview(req, res) {
  try {
    const { role, interactionMode = 'chat' } = req.body;

    // Validate input
    if (!role) {
      return res.status(400).json(createErrorResponse('Role is required', 400));
    }

    if (!isValidRole(role)) {
      return res.status(400).json(createErrorResponse('Invalid role selected', 400));
    }

    // Generate unique session ID
    const sessionId = generateSessionId();

    // Initialize interview with AI service
    const interviewData = await aiService.initializeInterview(
      sessionId,
      role,
      interactionMode
    );

    res.json(createSuccessResponse(interviewData, 'Interview started successfully'));
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json(createErrorResponse(error.message));
  }
}

/**
 * Send user response and get next question
 * POST /api/interview/respond
 * Body: { sessionId: string, message: string }
 */
async function sendResponse(req, res) {
  try {
    const { sessionId, message } = req.body;

    // Validate input
    if (!sessionId || !message) {
      return res.status(400).json(
        createErrorResponse('Session ID and message are required', 400)
      );
    }

    // Sanitize user input
    const sanitizedMessage = sanitizeInput(message);

    if (!sanitizedMessage) {
      return res.status(400).json(
        createErrorResponse('Message cannot be empty', 400)
      );
    }

    // Process response with AI service
    const aiResponse = await aiService.processResponse(sessionId, sanitizedMessage);

    res.json(createSuccessResponse(aiResponse, 'Response processed'));
  } catch (error) {
    console.error('Error processing response:', error);
    
    if (error.message.includes('Session not found')) {
      return res.status(404).json(createErrorResponse(error.message, 404));
    }
    
    res.status(500).json(createErrorResponse(error.message));
  }
}

/**
 * Get current interview session data
 * GET /api/interview/session/:sessionId
 */
async function getSession(req, res) {
  try {
    const { sessionId } = req.params;

    const session = aiService.getSession(sessionId);

    if (!session) {
      return res.status(404).json(
        createErrorResponse('Session not found', 404)
      );
    }

    // Return safe session data (without full conversation history)
    const safeSessionData = {
      sessionId: session.sessionId,
      role: session.role,
      interactionMode: session.interactionMode,
      questionCount: session.questionCount,
      phase: session.interviewPhase,
      startTime: session.startTime,
    };

    res.json(createSuccessResponse(safeSessionData));
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json(createErrorResponse(error.message));
  }
}

/**
 * End interview session
 * POST /api/interview/end
 * Body: { sessionId: string }
 */
async function endInterview(req, res) {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json(
        createErrorResponse('Session ID is required', 400)
      );
    }

    const session = aiService.endInterview(sessionId);

    res.json(createSuccessResponse(
      { sessionId, phase: session.interviewPhase },
      'Interview ended successfully'
    ));
  } catch (error) {
    console.error('Error ending interview:', error);
    res.status(500).json(createErrorResponse(error.message));
  }
}

module.exports = {
  startInterview,
  sendResponse,
  getSession,
  endInterview,
};

