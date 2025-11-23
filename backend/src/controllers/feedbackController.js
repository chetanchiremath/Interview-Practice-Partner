// Feedback Controller - Handles feedback generation
// Manages post-interview evaluation and feedback delivery

const aiService = require('../services/aiService');
const evaluationService = require('../services/evaluationService');
const { createSuccessResponse, createErrorResponse } = require('../utils/helpers');

/**
 * Generate comprehensive feedback for completed interview
 * POST /api/feedback/generate
 * Body: { sessionId: string, quick: boolean }
 */
async function generateFeedback(req, res) {
  try {
    const { sessionId, quick = false } = req.body;

    if (!sessionId) {
      return res.status(400).json(
        createErrorResponse('Session ID is required', 400)
      );
    }

    // Get session data
    const session = aiService.getSession(sessionId);

    if (!session) {
      return res.status(404).json(
        createErrorResponse('Session not found', 404)
      );
    }

    // SMART VALIDATION: Allow feedback but warn if incomplete
    const hasMinimumResponses = session.userResponses.length >= 3;
    const isProperlyCompleted = session.questionCount >= 5;
    
    // If NO responses at all, reject
    if (session.userResponses.length === 0) {
      return res.status(400).json(
        createErrorResponse('Cannot generate feedback - no responses provided. Please answer at least 3 questions.', 400)
      );
    }
    
    // Allow feedback but it will show low scores for incomplete interviews

    // Generate feedback (quick or comprehensive)
    let feedback;
    if (quick) {
      feedback = await evaluationService.generateQuickFeedback(session);
    } else {
      feedback = await evaluationService.generateFeedback(session);
    }

    // Clean up session after feedback generation
    aiService.deleteSession(sessionId);

    res.json(createSuccessResponse(feedback, 'Feedback generated successfully'));
  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json(createErrorResponse(error.message));
  }
}

/**
 * Get available roles for feedback context
 * GET /api/feedback/roles
 */
function getAvailableRoles(req, res) {
  const roles = [
    { 
      id: 'SOFTWARE_ENGINEER', 
      name: 'Software Engineer',
      description: 'Technical problem-solving and coding skills'
    },
    { 
      id: 'SALES_REPRESENTATIVE', 
      name: 'Sales Representative',
      description: 'Communication and persuasion abilities'
    },
    { 
      id: 'RETAIL_ASSOCIATE', 
      name: 'Retail Associate',
      description: 'Customer service and teamwork'
    },
    { 
      id: 'PRODUCT_MANAGER', 
      name: 'Product Manager',
      description: 'Strategy and stakeholder management'
    },
    { 
      id: 'DATA_ANALYST', 
      name: 'Data Analyst',
      description: 'Data analysis and business insights'
    },
    { 
      id: 'MARKETING_MANAGER', 
      name: 'Marketing Manager',
      description: 'Marketing strategy and campaigns'
    },
  ];

  res.json(createSuccessResponse(roles));
}

module.exports = {
  generateFeedback,
  getAvailableRoles,
};

