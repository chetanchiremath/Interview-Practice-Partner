/**
 * Agent Workflow Orchestration Service
 * 
 * This service coordinates the multi-agent interview system.
 * It manages the flow between agents:
 * 
 * Flow: User Answer → Analyzer → Orchestrator → Interviewer/Feedback → User
 * 
 * The workflow maintains interview state and ensures proper handoffs
 * between agents. This is the core of the agentic system.
 */

import type {
  InterviewState,
  InterviewerResponse,
  OrchestratorResponse,
  AnalyzerResponse,
  FeedbackResponse,
} from '../types/interview.types';
import { runAnalyzerAgent, updateAnalytics } from '../agents/analyzerAgent';
import { runOrchestratorAgent } from '../agents/orchestratorAgent';
import { runInterviewerAgent, generateOpeningQuestion } from '../agents/interviewerAgent';
import { runFeedbackAgent } from '../agents/feedbackAgent';

/**
 * In-memory session storage
 * In production, replace with Redis, MongoDB, or PostgreSQL
 */
const activeSessions = new Map<string, InterviewState>();

/**
 * Initialize a new interview session
 * 
 * @param sessionId - Unique session identifier
 * @param role - Job role for the interview
 * @param seniority - Candidate seniority level
 * @param interactionMode - Voice or chat
 * @returns Initial state and opening question
 */
export async function initializeInterviewSession(
  sessionId: string,
  role: InterviewState['role'],
  seniority: InterviewState['seniority'] = 'mid',
  interactionMode: InterviewState['interactionMode'] = 'chat'
): Promise<{ state: InterviewState; message: string }> {
  // Create initial state
  const state: InterviewState = {
    sessionId,
    role,
    seniority,
    history: [],
    analytics: {
      isChatty: false,
      isTooShort: false,
      avgAnswerLength: 0,
      notes: [],
    },
    status: 'opening',
    interactionMode,
    questionCount: 0,
    startTime: Date.now(),
  };

  // Store session
  activeSessions.set(sessionId, state);

  // Generate opening question (doesn't need agents yet)
  const openingMessage = generateOpeningQuestion(role, seniority);

  // Add opening question to history
  state.history.push({
    type: 'question',
    from: 'agent',
    content: openingMessage,
    timestamp: Date.now(),
  });

  state.questionCount = 1;

  return { state, message: openingMessage };
}

/**
 * Process a user's response through the multi-agent workflow
 * 
 * This is the core function that orchestrates all agents:
 * 1. Update state with user's answer
 * 2. Run Analyzer Agent to evaluate the answer
 * 3. Run Orchestrator Agent to decide next step
 * 4. Run Interviewer or Feedback Agent based on Orchestrator's decision
 * 5. Update state and return response
 * 
 * @param sessionId - Session identifier
 * @param userMessage - User's answer
 * @returns Next message and updated state
 */
export async function processUserResponse(
  sessionId: string,
  userMessage: string
): Promise<{
  message: string;
  shouldEnd: boolean;
  phase: InterviewState['status'];
  questionCount: number;
  analytics?: Partial<InterviewState['analytics']>;
}> {
  // Get session
  const state = activeSessions.get(sessionId);
  if (!state) {
    throw new Error('Session not found. Please start a new interview.');
  }

  console.log(`[WORKFLOW] Processing response for session ${sessionId}`);

  // Step 1: Add user's answer to history
  state.history.push({
    type: 'answer',
    from: 'user',
    content: userMessage,
    timestamp: Date.now(),
  });

  // Step 2: Run Analyzer Agent
  console.log('[WORKFLOW] Running Analyzer Agent...');
  let analysis: AnalyzerResponse;
  try {
    analysis = await runAnalyzerAgent(state, userMessage);
    console.log('[WORKFLOW] Analyzer completed:', {
      isChatty: analysis.isChatty,
      isTooShort: analysis.isTooShort,
      scores: {
        communication: analysis.communicationScore,
        technical: analysis.technicalScore,
      },
    });
  } catch (error) {
    console.error('[WORKFLOW] Analyzer failed, using default analysis:', error);
    // Provide default analysis if analyzer fails
    analysis = {
      isChatty: false,
      isTooShort: userMessage.length < 200,
      isOffTopic: false,
      communicationScore: 5,
      technicalScore: 5,
      behavioralScore: 5,
      confidenceScore: 5,
      engagementScore: 5,
      notes: 'Response received',
      strengths: [],
      weaknesses: [],
      suggestions: [],
    };
  }

  // Update state analytics
  const updatedState = updateAnalytics(state, analysis);
  activeSessions.set(sessionId, updatedState);

  // Step 3: Run Orchestrator Agent
  console.log('[WORKFLOW] Running Orchestrator Agent...');
  let orchestratorDecision: OrchestratorResponse;
  try {
    orchestratorDecision = await runOrchestratorAgent(updatedState, analysis);
    console.log('[WORKFLOW] Orchestrator decision:', {
      nextAgent: orchestratorDecision.nextAgent,
      nextIntent: orchestratorDecision.nextIntent,
      shouldEnd: orchestratorDecision.shouldEnd,
    });
  } catch (error) {
    console.error('[WORKFLOW] Orchestrator failed, using default decision:', error);
    // Provide default decision if orchestrator fails
    orchestratorDecision = {
      nextAgent: updatedState.questionCount >= 8 ? 'feedback' : 'interviewer',
      nextIntent: updatedState.questionCount >= 8 ? 'end_interview' : 'ask_role_specific',
      metadata: {
        difficulty: 'medium',
        reasoning: 'Fallback decision due to orchestrator error',
      },
      shouldEnd: updatedState.questionCount >= 8,
    };
  }

  // Step 4: Route to appropriate agent based on Orchestrator's decision
  if (orchestratorDecision.nextAgent === 'feedback' || orchestratorDecision.shouldEnd) {
    // End interview and transition to feedback
    updatedState.status = 'ended';
    updatedState.endTime = Date.now();
    activeSessions.set(sessionId, updatedState);

    console.log('[WORKFLOW] Interview ended, ready for feedback generation');

    return {
      message: "Thank you so much for your time today! I have all the information I need. You can now view your detailed feedback.",
      shouldEnd: true,
      phase: 'ended',
      questionCount: updatedState.questionCount,
      analytics: {
        communicationScore: updatedState.analytics.communicationScore,
        technicalScore: updatedState.analytics.technicalScore,
        behavioralScore: updatedState.analytics.behavioralScore,
      },
    };
  } else {
    // Step 5: Run Interviewer Agent to get next question
    console.log('[WORKFLOW] Running Interviewer Agent...');
    let interviewerResponse: InterviewerResponse;
    try {
      interviewerResponse = await runInterviewerAgent(updatedState, orchestratorDecision);
      console.log('[WORKFLOW] Interviewer generated question');
    } catch (error) {
      console.error('[WORKFLOW] Interviewer failed, using fallback question:', error);
      interviewerResponse = {
        message: "Tell me more about your experience with that.",
        questionType: orchestratorDecision.nextIntent,
      };
    }

    // Add interviewer's question to history
    updatedState.history.push({
      type: 'question',
      from: 'agent',
      content: interviewerResponse.message,
      timestamp: Date.now(),
    });

    // Increment question count
    updatedState.questionCount++;

    // Update interview phase
    if (updatedState.questionCount <= 2) {
      updatedState.status = 'opening';
    } else if (updatedState.questionCount <= 6) {
      updatedState.status = 'main';
    } else {
      updatedState.status = 'closing';
    }

    // Save updated state
    activeSessions.set(sessionId, updatedState);

    console.log(`[WORKFLOW] Question ${updatedState.questionCount} delivered, phase: ${updatedState.status}`);

    return {
      message: interviewerResponse.message,
      shouldEnd: false,
      phase: updatedState.status,
      questionCount: updatedState.questionCount,
      analytics: {
        isChatty: updatedState.analytics.isChatty,
        isTooShort: updatedState.analytics.isTooShort,
        communicationScore: updatedState.analytics.communicationScore,
        technicalScore: updatedState.analytics.technicalScore,
      },
    };
  }
}

/**
 * Generate comprehensive feedback for a completed interview
 * 
 * @param sessionId - Session identifier
 * @returns Detailed feedback
 */
export async function generateInterviewFeedback(
  sessionId: string
): Promise<FeedbackResponse> {
  const state = activeSessions.get(sessionId);
  if (!state) {
    throw new Error('Session not found');
  }

  console.log('[WORKFLOW] Generating feedback for session:', sessionId);

  // Ensure interview is marked as ended
  if (state.status !== 'ended') {
    state.status = 'ended';
    state.endTime = Date.now();
  }

  // Run Feedback Agent
  const feedback = await runFeedbackAgent(state);

  console.log('[WORKFLOW] Feedback generated:', {
    overallScore: feedback.overallScore,
    recommendation: feedback.recommendation,
  });

  // Clean up session after feedback (optional - you might want to keep for history)
  // activeSessions.delete(sessionId);

  return feedback;
}

/**
 * Get current session state
 * 
 * @param sessionId - Session identifier
 * @returns Current interview state or null if not found
 */
export function getSessionState(sessionId: string): InterviewState | null {
  return activeSessions.get(sessionId) || null;
}

/**
 * End an interview session early
 * 
 * @param sessionId - Session identifier
 */
export function endInterviewSession(sessionId: string): void {
  const state = activeSessions.get(sessionId);
  if (state) {
    state.status = 'ended';
    state.endTime = Date.now();
    activeSessions.set(sessionId, state);
  }
}

/**
 * Delete a session (cleanup)
 * 
 * @param sessionId - Session identifier
 */
export function deleteSession(sessionId: string): void {
  activeSessions.delete(sessionId);
}

/**
 * Get all active sessions (for debugging/admin)
 */
export function getAllActiveSessions(): Map<string, InterviewState> {
  return activeSessions;
}

