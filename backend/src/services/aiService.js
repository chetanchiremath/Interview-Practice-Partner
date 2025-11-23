// AI Service - Core conversational AI logic using Google Gemini
// Handles all interactions with Google Gemini API (FREE!)

const { model } = require('../config/gemini');
const SYSTEM_PROMPTS = require('../prompts/systemPrompts');
const ROLE_PROMPTS = require('../prompts/rolePrompts');
const { getOpeningQuestion, isUserConfused, isOffTopic } = require('../utils/questionBank');

// Store active interview sessions in memory (in production, use Redis or database)
const activeSessions = new Map();

/**
 * Initialize a new interview session
 * @param {string} sessionId - Unique session identifier
 * @param {string} role - Job role for the interview
 * @param {string} interactionMode - 'voice' or 'chat'
 * @returns {object} Session initialization data
 */
async function initializeInterview(sessionId, role, interactionMode = 'chat') {
  const roleKey = role.toUpperCase().replace(/\s+/g, '_');
  const roleConfig = ROLE_PROMPTS[roleKey];
  
  if (!roleConfig) {
    throw new Error(`Invalid role: ${role}`);
  }

  // Create system message combining base prompt and role-specific context
  const systemContext = `${SYSTEM_PROMPTS.BASE}\n\n${roleConfig.context}`;
  
  // Initialize conversation history
  // Note: Gemini doesn't use system messages like GPT, so we include it in first message
  const conversationHistory = [];

  // Store session data
  const sessionData = {
    sessionId,
    role,
    roleKey,
    interactionMode,
    conversationHistory,
    systemContext, // Store for use in every call
    questionCount: 0,
    startTime: new Date(),
    userResponses: [],
    interviewPhase: 'opening', // opening, main, closing, ended
    userPersona: 'normal', // normal, confused, efficient, chatty
  };

  activeSessions.set(sessionId, sessionData);

  // Generate opening question
  const openingQuestion = getOpeningQuestion(role);

  return {
    sessionId,
    role,
    message: openingQuestion,
    phase: 'opening',
  };
}

/**
 * Process user's response and generate next question using Gemini
 * @param {string} sessionId - Session identifier
 * @param {string} userMessage - User's response
 * @returns {object} AI's response and updated session state
 */
async function processResponse(sessionId, userMessage) {
  const session = activeSessions.get(sessionId);
  
  if (!session) {
    throw new Error('Session not found. Please start a new interview.');
  }

  // Store user response for later evaluation
  const lastQuestion = session.conversationHistory.length > 0 
    ? session.conversationHistory[session.conversationHistory.length - 1].parts 
    : 'Initial greeting';

  session.userResponses.push({
    question: lastQuestion,
    answer: userMessage,
    timestamp: new Date(),
  });

  // Detect user persona for adaptive behavior
  detectUserPersona(session, userMessage);

  // Build the full conversation context for Gemini
  const conversationContext = buildConversationContext(session);
  const additionalInstructions = buildAdditionalInstructions(session);

  // Create the prompt with full context - MORE NATURAL!
  const fullPrompt = `${session.systemContext}

${additionalInstructions ? additionalInstructions + '\n\n' : ''}

CONVERSATION SO FAR:
${conversationContext}

CANDIDATE JUST SAID: "${userMessage}"

YOUR TURN (as Sarah, the interviewer):
Respond naturally as a real human interviewer would. Remember:
- Show you're listening: "I see", "That's interesting", "Great"
- React authentically to what they said
- Keep it conversational and warm
- Ask your next question naturally
- 2-4 sentences max - like real conversation
- Sound human, not scripted!

What do you say next?`;

  try {
    // Call Gemini API
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const assistantResponse = response.text();

    // Add to conversation history
    session.conversationHistory.push({
      role: 'user',
      parts: userMessage,
    });
    session.conversationHistory.push({
      role: 'model',
      parts: assistantResponse,
    });

    // Update interview phase
    session.questionCount++;
    updateInterviewPhase(session);

    // Check if interview should end
    const shouldEnd = checkIfInterviewShouldEnd(session, assistantResponse);

    return {
      sessionId,
      message: assistantResponse,
      phase: session.interviewPhase,
      questionCount: session.questionCount,
      shouldEnd,
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate response. Please try again.');
  }
}

/**
 * Build conversation context string from history
 * @param {object} session - Session data
 * @returns {string} Formatted conversation history
 */
function buildConversationContext(session) {
  if (session.conversationHistory.length === 0) {
    return '(Interview just started)';
  }

  return session.conversationHistory
    .map(msg => {
      const role = msg.role === 'user' ? 'Candidate' : 'Interviewer';
      return `${role}: ${msg.parts}`;
    })
    .join('\n');
}

/**
 * Detect user persona based on their responses
 * @param {object} session - Session data
 * @param {string} userMessage - Latest user message
 */
function detectUserPersona(session, userMessage) {
  // Check for confused user
  if (isUserConfused(userMessage)) {
    session.userPersona = 'confused';
    return;
  }

  // Check for efficient user (short, direct responses)
  if (userMessage.split(/\s+/).length < 30 && session.questionCount > 2) {
    session.userPersona = 'efficient';
    return;
  }

  // Check for chatty user (very long responses or off-topic)
  if (userMessage.split(/\s+/).length > 200 || isOffTopic(userMessage)) {
    session.userPersona = 'chatty';
    return;
  }

  session.userPersona = 'normal';
}

/**
 * Build additional instructions based on session context
 * @param {object} session - Session data
 * @returns {string} Additional instructions for AI
 */
function buildAdditionalInstructions(session) {
  let instructions = '';

  // Add persona-specific instructions
  if (session.userPersona === 'confused') {
    instructions += SYSTEM_PROMPTS.CONFUSED_USER + '\n';
  } else if (session.userPersona === 'efficient') {
    instructions += SYSTEM_PROMPTS.EFFICIENT_USER + '\n';
  } else if (session.userPersona === 'chatty') {
    instructions += SYSTEM_PROMPTS.CHATTY_USER + '\n';
  }

  // Add phase-specific instructions
  if (session.interviewPhase === 'closing') {
    instructions += '\nThe interview is coming to an end. Ask if they have any questions for you, then provide a brief closing statement.';
  }

  return instructions || null;
}

/**
 * Update interview phase based on question count
 * @param {object} session - Session data
 */
function updateInterviewPhase(session) {
  if (session.questionCount === 1) {
    session.interviewPhase = 'opening';
  } else if (session.questionCount < 6) {
    session.interviewPhase = 'main';
  } else if (session.questionCount < 8) {
    session.interviewPhase = 'closing';
  } else {
    session.interviewPhase = 'ended';
  }
}

/**
 * Check if interview should end
 * @param {object} session - Session data
 * @param {string} response - Latest AI response
 * @returns {boolean} True if interview should end
 */
function checkIfInterviewShouldEnd(session, response) {
  // End after 8-10 questions or if closing phrases detected
  if (session.questionCount >= 8) {
    return true;
  }

  const closingPhrases = [
    'thank you for your time',
    'that concludes our interview',
    'we\'ll be in touch',
    'end of the interview',
  ];

  const lowerResponse = response.toLowerCase();
  return closingPhrases.some(phrase => lowerResponse.includes(phrase));
}

/**
 * Get session data
 * @param {string} sessionId - Session identifier
 * @returns {object} Session data
 */
function getSession(sessionId) {
  return activeSessions.get(sessionId);
}

/**
 * End interview session
 * @param {string} sessionId - Session identifier
 * @returns {object} Final session data
 */
function endInterview(sessionId) {
  const session = activeSessions.get(sessionId);
  
  if (!session) {
    throw new Error('Session not found');
  }

  session.endTime = new Date();
  session.interviewPhase = 'ended';
  
  return session;
}

/**
 * Delete session from memory
 * @param {string} sessionId - Session identifier
 */
function deleteSession(sessionId) {
  activeSessions.delete(sessionId);
}

module.exports = {
  initializeInterview,
  processResponse,
  getSession,
  endInterview,
  deleteSession,
};
