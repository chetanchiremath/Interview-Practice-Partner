/**
 * Interviewer Agent - Generates Questions for the Interview
 * 
 * This agent is responsible for:
 * - Asking questions appropriate to role, seniority, and interview stage
 * - Following the intent provided by the Orchestrator
 * - Sounding natural and human-like (not robotic)
 * - Adapting tone based on interaction mode (voice vs chat)
 * - Providing appropriate difficulty based on candidate performance
 * 
 * The Interviewer should behave like a realistic, professional interviewer:
 * - Warm but professional
 * - Concise (2-4 sentences for voice, can be longer for chat)
 * - Natural transitions and acknowledgments
 */

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import type {
  InterviewState,
  InterviewerResponse,
  OrchestratorResponse
} from '../types/interview.types';

/**
 * The Interviewer Agent generates the next question
 * 
 * @param state - Current interview state
 * @param orchestratorDecision - Decision from Orchestrator about what to ask
 * @returns The next question/message for the candidate
 */
export async function runInterviewerAgent(
  state: InterviewState,
  orchestratorDecision: OrchestratorResponse
): Promise<InterviewerResponse> {
  // Initialize the LLM (using Gemini - FREE!)
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0.7, // Higher temperature for more natural, varied questions
    apiKey: process.env.GEMINI_API_KEY,
  });

  // Determine the interviewer's persona and style
  const isVoice = state.interactionMode === 'voice';
  const lengthGuideline = isVoice
    ? '2-3 sentences max (voice should be concise)'
    : '2-4 sentences (can be slightly longer for text)';

  // Build role-specific context
  const roleContext = getRoleContext(state.role);

  // Build intent-specific instructions
  const intentInstructions = getIntentInstructions(orchestratorDecision.nextIntent);

  // Create the interviewer prompt
  const interviewerPrompt = PromptTemplate.fromTemplate(`
You are Sarah, an experienced and friendly interviewer conducting a {role} interview.

CANDIDATE CONTEXT:
- Role: {role}
- Seniority Level: {seniority}
- Question Number: {questionNumber}
- Interview Phase: {status}
- Mode: {interactionMode}

YOUR TASK:
{intentInstructions}

ROLE-SPECIFIC CONTEXT:
{roleContext}

ORCHESTRATOR GUIDANCE:
- Difficulty: {difficulty}
- Focus Areas: {focusAreas}
- Provide Hint: {provideHint}
- Reasoning: {reasoning}

RECENT CONVERSATION:
{recentHistory}

CANDIDATE'S LAST ANSWER:
{lastAnswer}

INTERVIEWER GUIDELINES:
1. Sound natural and human - you're having a conversation, not reading a script
2. Acknowledge what they just said briefly before moving on (e.g., "I see", "That's interesting", "Great")
3. Keep it concise: {lengthGuideline}
4. Ask ONE clear question at a time
5. Match the tone to the mode:
   - Voice: Very conversational, like talking to a person
   - Chat: Professional but still warm
6. Don't be overly formal or robotic
7. If providing a hint, do so naturally and encouragingly

YOUR RESPONSE (as Sarah):
`);

  // Get recent history
  const recentHistory = state.history
    .slice(-4)
    .map(msg => `${msg.from === 'user' ? 'Candidate' : 'You'}: ${msg.content}`)
    .join('\n');

  const lastAnswer = state.history.length > 0
    ? state.history[state.history.length - 1]?.content ?? '(No previous answer - this is the opening)'
    : '(No previous answer - this is the opening)';

  // Format the prompt
  const formattedPrompt = await interviewerPrompt.format({
    role: state.role,
    seniority: state.seniority,
    questionNumber: state.questionCount + 1,
    status: state.status,
    interactionMode: state.interactionMode,
    intentInstructions,
    roleContext,
    difficulty: orchestratorDecision.metadata.difficulty || 'medium',
    focusAreas: orchestratorDecision.metadata.focusAreas?.join(', ') || 'General interview flow',
    provideHint: orchestratorDecision.metadata.provideHint || false,
    reasoning: orchestratorDecision.metadata.reasoning || '',
    recentHistory: recentHistory || '(Interview just starting)',
    lastAnswer,
    lengthGuideline,
  });

  try {
    // Run the LLM
    const result = await model.invoke(formattedPrompt);
    const message = ((result.content as string) || '').trim();

    return {
      message,
      questionType: orchestratorDecision.nextIntent,
      metadata: {
        expectedLength: orchestratorDecision.nextIntent === 'ask_behavioral' ? 'long' : 'medium',
        keyPoints: orchestratorDecision.metadata?.focusAreas,
      },
    };
  } catch (error) {
    console.error('Interviewer Agent error:', error);

    // Fallback: Simple question
    return createFallbackQuestion(state, orchestratorDecision);
  }
}

/**
 * Get role-specific context for the interviewer
 */
function getRoleContext(role: string): string {
  const contexts: Record<string, string> = {
    backend: 'Focus on: system design, databases, APIs, scalability, backend technologies (Node.js, Python, Java, etc.)',
    frontend: 'Focus on: React/Angular/Vue, UI/UX, responsive design, state management, browser APIs',
    fullstack: 'Focus on: both frontend and backend, how they connect, full application architecture',
    sales: 'Focus on: sales techniques, customer relationships, handling objections, closing deals, metrics',
    retail: 'Focus on: customer service, teamwork, handling difficult customers, retail operations',
    product_manager: 'Focus on: product strategy, stakeholder management, prioritization, metrics, user needs',
    data_analyst: 'Focus on: SQL, data visualization, statistical analysis, business insights, reporting',
    marketing_manager: 'Focus on: marketing strategy, campaigns, analytics, brand management, ROI',
  };

  return contexts[role] || 'Focus on general skills and experience relevant to the role.';
}

/**
 * Get intent-specific instructions for the interviewer
 */
function getIntentInstructions(intent: string): string {
  const instructions: Record<string, string> = {
    ask_behavioral: 'Ask a behavioral question that requires a detailed story. Use "Tell me about a time when..." format. Look for STAR structure (Situation, Task, Action, Result).',
    ask_technical: 'Ask a technical question that tests their knowledge. Can be conceptual or practical.',
    ask_role_specific: 'Ask a question specific to their role that shows real-world understanding.',
    ask_system_design: 'Ask a system design question. Request them to architect a solution or explain how they would build something.',
    probe_answer: 'Follow up on what they just said. Ask for more detail, clarification, or a specific example.',
    ask_closing: 'Ask if they have any questions for you, or provide a brief closing statement thanking them.',
    end_interview: 'Provide a warm closing statement thanking them for their time.',
    continue_conversation: 'Continue the conversation naturally. If the candidate was off-topic (check Focus Areas), politely steer them back to the interview topic.',
  };

  return instructions[intent] || 'Ask an appropriate interview question.';
}

/**
 * Fallback question generation if LLM fails
 */
function createFallbackQuestion(
  state: InterviewState,
  decision: OrchestratorResponse
): InterviewerResponse {
  const questionCount = state.questionCount;

  // Simple fallback questions
  const fallbackQuestions: Record<string, string[]> = {
    ask_behavioral: [
      "Tell me about a time when you faced a significant challenge at work. How did you handle it?",
      "Can you describe a situation where you had to work with a difficult team member?",
      "Tell me about a project you're particularly proud of and why.",
    ],
    ask_technical: [
      "What technologies are you most comfortable working with?",
      "Can you explain a complex technical concept in simple terms?",
      "What's your approach to debugging when something goes wrong?",
    ],
    ask_role_specific: [
      `What interests you most about working in ${state.role}?`,
      `What do you think are the most important skills for a ${state.role}?`,
    ],
    ask_closing: [
      "That's great, thank you. Do you have any questions for me?",
      "We're coming to the end of our time. Is there anything else you'd like to share?",
    ],
  };

  const questions = fallbackQuestions[decision.nextIntent] || fallbackQuestions.ask_behavioral;
  const selectedQuestion = questions?.[questionCount % (questions?.length || 1)];

  return {
    message: selectedQuestion ?? 'Tell me more about your experience.',
    questionType: decision.nextIntent,
  };
}

/**
 * Generate the opening question for an interview
 * Called at the start before any agents run
 */
export function generateOpeningQuestion(role: string, _seniority: string): string {
  const greetings = [
    `Hi! I'm Sarah, and I'll be interviewing you today for the ${role} position. Let's start with - tell me a bit about yourself and your background in ${role}.`,
    `Hello! Thanks for joining me today. I'm Sarah and I'm excited to learn more about you. To get us started, could you walk me through your experience in ${role}?`,
    `Welcome! I'm Sarah, your interviewer today. Let's dive in - tell me about your journey into ${role} and what you're most passionate about.`,
  ];

  return greetings[Math.floor(Math.random() * greetings.length)] ?? greetings[0] ?? '';
}

