// Evaluation Service - Post-interview feedback generation using Gemini
// Analyzes user responses and generates comprehensive feedback

const { model } = require('../config/gemini');
const ROLE_PROMPTS = require('../prompts/rolePrompts');
const { calculateDuration } = require('../utils/helpers');

/**
 * Generate comprehensive interview feedback using Gemini
 * @param {object} session - Interview session data
 * @returns {object} Detailed feedback and scores
 */
async function generateFeedback(session) {
  const roleConfig = ROLE_PROMPTS[session.roleKey];
  
  if (!roleConfig) {
    throw new Error('Invalid role configuration');
  }

  // Prepare conversation summary for evaluation
  const conversationSummary = session.userResponses
    .map((item, index) => `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`)
    .join('\n\n');

  // Build evaluation prompt
  const evaluationPrompt = `You are an expert interviewer evaluating a candidate's performance in a ${session.role} interview.

Interview Transcript:
${conversationSummary}

Evaluation Criteria for ${session.role}:
${roleConfig.evaluationCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Please provide a comprehensive evaluation in the following JSON format (RETURN ONLY VALID JSON, NO MARKDOWN):
{
  "overallScore": <number 1-10>,
  "scores": {
    "communication": <number 1-10>,
    "technicalKnowledge": <number 1-10>,
    "problemSolving": <number 1-10>,
    "confidence": <number 1-10>,
    "relevance": <number 1-10>
  },
  "strengths": [
    "Specific strength with example from interview"
  ],
  "improvements": [
    "Specific area to improve with actionable advice"
  ],
  "highlights": [
    "Best response or moment from the interview"
  ],
  "redFlags": [
    "Any concerning responses or patterns (if any)"
  ],
  "overallFeedback": "2-3 paragraph comprehensive summary",
  "recommendation": "STRONG_HIRE or HIRE or MAYBE or NO_HIRE"
}

Be specific, reference actual responses, and provide actionable feedback. Return ONLY the JSON object.`;

  try {
    // Call Gemini for evaluation
    const result = await model.generateContent(evaluationPrompt);
    const response = await result.response;
    const feedbackText = response.text();
    
    // Parse JSON response
    let feedback;
    try {
      // Remove markdown code blocks if present
      const jsonText = feedbackText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      feedback = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse feedback JSON:', parseError);
      console.error('Raw response:', feedbackText);
      // Fallback to basic feedback
      feedback = createFallbackFeedback(session);
    }

    // Add metadata
    const duration = calculateDuration(session.startTime, session.endTime || new Date());
    
    return {
      sessionId: session.sessionId,
      role: session.role,
      duration: `${duration} minutes`,
      questionCount: session.questionCount,
      ...feedback,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Feedback generation error:', error);
    // Return fallback feedback instead of throwing
    const duration = calculateDuration(session.startTime, session.endTime || new Date());
    return {
      sessionId: session.sessionId,
      role: session.role,
      duration: `${duration} minutes`,
      questionCount: session.questionCount,
      ...createFallbackFeedback(session),
      generatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Create fallback feedback if AI evaluation fails
 * NOW WITH SMART SCORING based on actual participation!
 * @param {object} session - Session data
 * @returns {object} Basic feedback structure
 */
function createFallbackFeedback(session) {
  // Count actual user responses
  const responseCount = session.userResponses.length;
  const questionCount = session.questionCount;
  
  // Calculate average response length
  const avgResponseLength = responseCount > 0
    ? session.userResponses.reduce((sum, r) => sum + r.answer.length, 0) / responseCount
    : 0;
  
  // SMART SCORING based on participation
  let overallScore = 1; // Start at 1
  let recommendation = 'NO_HIRE';
  let strengths = [];
  let improvements = [];
  let redFlags = [];
  let overallFeedback = '';
  
  // Score based on completion
  if (responseCount === 0) {
    // NO RESPONSES AT ALL
    overallScore = 1;
    recommendation = 'NO_HIRE';
    strengths = [];
    improvements = [
      'Complete the full interview before requesting feedback',
      'Provide thoughtful responses to each question',
      'Take time to prepare examples from your experience',
    ];
    redFlags = [
      'Interview ended with no responses provided',
      'Unable to assess candidate abilities',
    ];
    overallFeedback = 'The interview was ended without any responses. To get meaningful feedback, please complete a full interview with thoughtful answers to each question. Practice interviews require participation to generate useful insights.';
  } else if (responseCount < 3 || questionCount < 3) {
    // TOO FEW RESPONSES
    overallScore = 2;
    recommendation = 'NO_HIRE';
    strengths = [
      'Started the interview process',
    ];
    improvements = [
      'Complete more questions to receive comprehensive feedback (minimum 3-4 questions recommended)',
      'Provide detailed responses to demonstrate your abilities',
      'Take the practice seriously - it helps prepare for real interviews',
    ];
    redFlags = [
      `Only ${responseCount} response(s) provided - insufficient to evaluate`,
      'Interview ended prematurely',
    ];
    overallFeedback = `The interview was cut short with only ${responseCount} response(s). To get meaningful feedback and practice effectively, complete at least 5-7 questions. Full interviews help you practice maintaining focus and consistency throughout the conversation.`;
  } else if (avgResponseLength < 20) {
    // VERY SHORT RESPONSES
    overallScore = 3;
    recommendation = 'NO_HIRE';
    strengths = [
      'Completed some interview questions',
      'Attempted to provide responses',
    ];
    improvements = [
      'Provide more detailed responses (aim for 50-100 words minimum)',
      'Include specific examples and details in your answers',
      'Use the STAR method (Situation, Task, Action, Result) to structure responses',
    ];
    redFlags = [
      'Responses were too brief (average ' + Math.round(avgResponseLength) + ' characters)',
      'Insufficient detail to assess skills and experience',
    ];
    overallFeedback = 'Your responses were very brief, making it difficult to assess your qualifications. In real interviews, aim for 1-2 minute responses with specific examples. Practice elaborating on your experiences with concrete details and measurable outcomes.';
  } else if (responseCount < 5) {
    // INCOMPLETE INTERVIEW
    overallScore = 4;
    recommendation = 'NO_HIRE';
    strengths = [
      'Provided responses to multiple questions',
      'Attempted to engage with the interview process',
    ];
    improvements = [
      'Complete full interviews (7-8 questions) for comprehensive practice',
      'Provide more specific examples from your experience',
      'Practice maintaining energy and focus throughout entire interviews',
    ];
    redFlags = [
      'Interview incomplete - only ' + responseCount + ' responses provided',
    ];
    overallFeedback = `You provided ${responseCount} responses but ended the interview early. Full interviews typically have 7-8 questions. Practice completing entire interviews to build stamina and consistency. Each question is an opportunity to showcase different aspects of your experience.`;
  } else {
    // DECENT PARTICIPATION (5+ responses)
    overallScore = 5 + Math.min(2, Math.floor(avgResponseLength / 100));
    recommendation = responseCount >= 7 ? 'MAYBE' : 'NO_HIRE';
    strengths = [
      'Completed multiple interview questions',
      'Provided responses to all questions asked',
      responseCount >= 7 ? 'Maintained engagement throughout the interview' : 'Showed willingness to participate',
    ];
    improvements = [
      'Consider providing more detailed examples in your responses',
      'Practice structuring answers using the STAR method',
      'Work on being more specific when describing your experiences',
    ];
    redFlags = responseCount < 7 ? ['Interview ended before completion'] : [];
    overallFeedback = `You participated in ${responseCount} questions with an average response length of ${Math.round(avgResponseLength)} characters. ${responseCount >= 7 ? 'Good job completing the interview!' : 'Try completing full interviews (7-8 questions) for better practice.'} Focus on providing specific examples from your experience and structuring your answers clearly. The more you practice, the more comfortable you'll become with interview conversations.`;
  }
  
  return {
    overallScore,
    scores: {
      communication: Math.max(1, overallScore - 1),
      technicalKnowledge: Math.max(1, overallScore - 1),
      problemSolving: Math.max(1, overallScore),
      confidence: Math.max(1, overallScore),
      relevance: Math.max(1, overallScore - 2),
    },
    strengths,
    improvements,
    highlights: strengths,
    redFlags,
    overallFeedback,
    recommendation,
  };
}

/**
 * Generate quick feedback summary (for efficient users)
 * @param {object} session - Session data
 * @returns {object} Brief feedback
 */
async function generateQuickFeedback(session) {
  const fullFeedback = await generateFeedback(session);
  
  return {
    sessionId: session.sessionId,
    overallScore: fullFeedback.overallScore,
    topStrengths: fullFeedback.strengths.slice(0, 2),
    topImprovements: fullFeedback.improvements.slice(0, 2),
    recommendation: fullFeedback.recommendation,
  };
}

module.exports = {
  generateFeedback,
  generateQuickFeedback,
};
