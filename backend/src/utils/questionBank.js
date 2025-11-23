// Question Bank Utilities
// Helper functions for managing interview questions

const ROLE_PROMPTS = require('../prompts/rolePrompts');

// Common behavioral questions that work across all roles
const COMMON_BEHAVIORAL_QUESTIONS = [
  "Tell me about yourself and your background.",
  "What are your greatest strengths?",
  "What is your biggest weakness and how are you working to improve it?",
  "Why are you interested in this position?",
  "Where do you see yourself in 5 years?",
  "Tell me about a time you faced a challenge and how you overcame it.",
  "Describe a situation where you had to work with a difficult colleague.",
  "What motivates you in your work?",
  "How do you handle stress and pressure?",
  "Why should we hire you?",
];

// Follow-up question templates based on response patterns
const FOLLOW_UP_TEMPLATES = {
  vague: [
    "Can you provide a specific example?",
    "Could you elaborate on that with more details?",
    "What was the outcome of that situation?",
  ],
  good: [
    "That's interesting. How did that experience shape your approach?",
    "What did you learn from that experience?",
    "How would you apply that in this role?",
  ],
  technical: [
    "What technologies or tools did you use?",
    "What challenges did you face during implementation?",
    "How did you measure success?",
  ],
};

/**
 * Get questions for a specific role
 * @param {string} role - The job role
 * @returns {object} Role-specific questions and context
 */
function getQuestionsForRole(role) {
  const roleKey = role.toUpperCase().replace(/\s+/g, '_');
  return ROLE_PROMPTS[roleKey] || null;
}

/**
 * Generate follow-up question based on response quality
 * @param {string} response - User's response
 * @param {string} context - Current question context
 * @returns {string} Follow-up question suggestion
 */
function generateFollowUpPrompt(response, context) {
  // Simple heuristic: if response is short or vague, ask for specifics
  if (response.length < 50) {
    return "Please provide more details and specific examples.";
  }
  
  // If response contains "I would" but no past examples
  if (response.includes("I would") && !response.includes("I did")) {
    return "Can you share a specific example from your past experience?";
  }
  
  return "Tell me more about that.";
}

/**
 * Get opening question based on role - NOW MORE CONVERSATIONAL!
 * @param {string} role - The job role
 * @returns {string} Opening question
 */
function getOpeningQuestion(role) {
  const formattedRole = role.replace(/_/g, ' ').toLowerCase();
  
  // Vary the opening to sound more natural
  const openings = [
    `Hi there! Thanks for joining me today. I'm Sarah, and I'll be interviewing you for the ${formattedRole} position. How are you doing today? To start, I'd love to hear a bit about yourself and what draws you to this role.`,
    
    `Hey! Great to meet you. I'm Sarah, your interviewer for today's ${formattedRole} position. Before we dive in, how's your day going so far? Alright, so tell me - what interests you about this role, and give me a quick overview of your background.`,
    
    `Welcome! I'm Sarah, and I'm excited to learn more about you for the ${formattedRole} position. Thanks for taking the time to chat with me today. So, let's start with the basics - tell me a bit about yourself and why you're interested in this opportunity.`,
  ];
  
  // Return a random opening to keep it fresh
  return openings[Math.floor(Math.random() * openings.length)];
}

/**
 * Check if response indicates confusion
 * @param {string} response - User's response
 * @returns {boolean} True if user seems confused
 */
function isUserConfused(response) {
  const confusionKeywords = [
    "not sure", "don't know", "unsure", "confused", 
    "help me choose", "what should i", "i don't understand"
  ];
  
  const lowerResponse = response.toLowerCase();
  return confusionKeywords.some(keyword => lowerResponse.includes(keyword));
}

/**
 * Check if response is off-topic or too chatty
 * @param {string} response - User's response
 * @param {string} questionContext - The question asked
 * @returns {boolean} True if response seems off-topic
 */
function isOffTopic(response, questionContext) {
  // Simple heuristic: very long responses (>500 words) might be too chatty
  const wordCount = response.split(/\s+/).length;
  return wordCount > 500;
}

module.exports = {
  COMMON_BEHAVIORAL_QUESTIONS,
  FOLLOW_UP_TEMPLATES,
  getQuestionsForRole,
  generateFollowUpPrompt,
  getOpeningQuestion,
  isUserConfused,
  isOffTopic,
};

