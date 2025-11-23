/**
 * Type Definitions for Multi-Agent Interview System
 * 
 * This file defines the core types used across the agentic interview platform.
 * The system uses multiple cooperating agents (Orchestrator, Interviewer, Analyzer, Feedback)
 * to conduct realistic, adaptive mock interviews.
 */

// ============================================================================
// CORE INTERVIEW STATE
// ============================================================================

/**
 * Role types supported by the interview system
 */
export type Role =
  | 'backend'
  | 'frontend'
  | 'fullstack'
  | 'sales'
  | 'retail'
  | 'product_manager'
  | 'data_analyst'
  | 'marketing_manager';

/**
 * Seniority levels for candidates
 */
export type Seniority = 'junior' | 'mid' | 'senior';

/**
 * Interview phases throughout the conversation
 */
export type InterviewPhase = 'not_started' | 'opening' | 'main' | 'closing' | 'ended';

/**
 * Interaction modes (voice or text chat)
 */
export type InteractionMode = 'voice' | 'chat';

/**
 * Message types in conversation history
 */
export type MessageType = 'question' | 'answer' | 'system';

/**
 * Sender of the message
 */
export type MessageFrom = 'user' | 'agent' | 'system';

/**
 * Individual message in the conversation
 */
export interface ConversationMessage {
  type: MessageType;
  from: MessageFrom;
  content: string;
  timestamp: number;
}

/**
 * Analytics captured during the interview
 * Updated by the Analyzer Agent after each user response
 */
export interface InterviewAnalytics {
  /** Is the candidate being too chatty/verbose? */
  isChatty: boolean;

  /** Is the candidate giving very brief answers? */
  isTooShort: boolean;

  /** Is the candidate going off-topic? */
  isOffTopic?: boolean;

  /** Average length of user answers (in characters) */
  avgAnswerLength: number;

  /** Communication skills score (0-10) */
  communicationScore?: number;

  /** Technical knowledge score (0-10) */
  technicalScore?: number;

  /** Behavioral/STAR structure score (0-10) */
  behavioralScore?: number;

  /** Confidence level (0-10) */
  confidenceScore?: number;

  /** Overall engagement score (0-10) */
  engagementScore?: number;

  /** Cumulative notes from the analyzer */
  notes: string[];
}

/**
 * Complete state of an interview session
 * This is the central data structure passed between agents
 */
export interface InterviewState {
  /** Unique session identifier */
  sessionId: string;

  /** Job role being interviewed for */
  role: Role;

  /** Candidate's seniority level */
  seniority: Seniority;

  /** Full conversation history */
  history: ConversationMessage[];

  /** Real-time analytics from Analyzer Agent */
  analytics: InterviewAnalytics;

  /** Current interview phase */
  status: InterviewPhase;

  /** Interaction mode (voice or chat) */
  interactionMode: InteractionMode;

  /** Number of questions asked so far */
  questionCount: number;

  /** When the interview started */
  startTime: number;

  /** When the interview ended (if ended) */
  endTime?: number;

  /** Additional metadata */
  metadata?: Record<string, any>;
}

// ============================================================================
// AGENT RESPONSES
// ============================================================================

/**
 * Next agent to invoke in the workflow
 */
export type NextAgent = 'interviewer' | 'analyzer' | 'feedback' | 'end';

/**
 * Intent/action for the next step
 */
export type NextIntent =
  | 'ask_behavioral'          // Ask a behavioral/STAR question
  | 'ask_technical'            // Ask a technical question
  | 'ask_system_design'        // Ask a system design question
  | 'ask_role_specific'        // Ask a role-specific question
  | 'probe_answer'             // Probe/follow-up on last answer
  | 'ask_closing'              // Ask closing questions
  | 'end_interview'            // End the interview
  | 'continue_conversation';   // Continue naturally

/**
 * Difficulty level for questions
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Orchestrator Agent Output
 * 
 * The Orchestrator is the "brain" that decides:
 * - Should we continue or end?
 * - What type of question should come next?
 * - Which agent should handle the next step?
 */
export interface OrchestratorResponse {
  /** Which agent should act next */
  nextAgent: NextAgent;

  /** What should that agent do */
  nextIntent: NextIntent;

  /** Additional metadata for the next agent */
  metadata: {
    /** Suggested difficulty level */
    difficulty?: DifficultyLevel;

    /** Areas to focus on */
    focusAreas?: string[];

    /** Should we give a hint? */
    provideHint?: boolean;

    /** Reason for this decision (for debugging) */
    reasoning?: string;
  };

  /** Should the interview end after this turn? */
  shouldEnd: boolean;
}

/**
 * Analyzer Agent Output
 * 
 * The Analyzer evaluates each user response and provides structured feedback
 * that influences how the Orchestrator routes the conversation.
 */
export interface AnalyzerResponse {
  /** Is the candidate being too verbose? */
  isChatty: boolean;

  /** Is the candidate giving too brief answers? */
  isTooShort: boolean;

  /** Is the candidate going off-topic? */
  isOffTopic: boolean;

  /** Communication quality (0-10) */
  communicationScore: number;

  /** Technical depth (0-10) */
  technicalScore: number;

  /** Behavioral/STAR structure (0-10) */
  behavioralScore: number;

  /** Confidence level (0-10) */
  confidenceScore: number;

  /** Overall engagement (0-10) */
  engagementScore: number;

  /** Natural language analysis of this response */
  notes: string;

  /** Strengths observed in this response */
  strengths: string[];

  /** Weaknesses observed in this response */
  weaknesses: string[];

  /** Suggested improvements for the candidate */
  suggestions: string[];
}

/**
 * Interviewer Agent Output
 * 
 * The Interviewer generates the next question based on context and intent
 */
export interface InterviewerResponse {
  /** The question/message to the candidate (plain text, ready for TTS) */
  message: string;

  /** Type of question asked */
  questionType: NextIntent;

  /** Metadata about this question */
  metadata?: {
    /** Expected answer length */
    expectedLength?: 'short' | 'medium' | 'long';

    /** Key points to listen for */
    keyPoints?: string[];
  };
}

/**
 * Feedback Agent Output
 * 
 * The Feedback Agent provides comprehensive end-of-interview evaluation
 */
export interface FeedbackResponse {
  /** Session identifier */
  sessionId: string;

  /** Role interviewed for */
  role: Role;

  /** Interview duration */
  duration: string;

  /** Total questions asked */
  questionCount: number;

  /** Overall performance score (0-10) */
  overallScore: number;

  /** Breakdown of scores */
  scores: {
    communication: number;
    technicalKnowledge: number;
    problemSolving: number;
    confidence: number;
    relevance: number;
  };

  /** Candidate's key strengths */
  strengths: string[];

  /** Areas for improvement */
  improvements: string[];

  /** Best moments from the interview */
  highlights: string[];

  /** Concerning patterns (if any) */
  redFlags: string[];

  /** Overall narrative feedback (2-3 paragraphs) */
  overallFeedback: string;

  /** Hiring recommendation */
  recommendation: 'STRONG_HIRE' | 'HIRE' | 'MAYBE' | 'NO_HIRE';

  /** Sample improved answers (optional) */
  modelAnswers?: Array<{
    question: string;
    userAnswer: string;
    improvedAnswer: string;
  }>;

  /** When feedback was generated */
  generatedAt: string;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Request to start a new interview
 */
export interface StartInterviewRequest {
  role: Role;
  seniority?: Seniority;
  interactionMode?: InteractionMode;
}

/**
 * Response when starting an interview
 */
export interface StartInterviewResponse {
  sessionId: string;
  role: Role;
  seniority: Seniority;
  message: string;
  phase: InterviewPhase;
}

/**
 * Request to send a user response
 */
export interface SendResponseRequest {
  sessionId: string;
  message: string;
}

/**
 * Response after processing user's answer
 */
export interface SendResponseResponse {
  sessionId: string;
  message: string;
  phase: InterviewPhase;
  questionCount: number;
  shouldEnd: boolean;
  analytics?: Partial<InterviewAnalytics>;
}

/**
 * Request to generate feedback
 */
export interface GenerateFeedbackRequest {
  sessionId: string;
  quick?: boolean;
}

// ============================================================================
// VOICE I/O TYPES
// ============================================================================

/**
 * Request for Speech-to-Text
 */
export interface STTRequest {
  /** Audio data (base64 or buffer) */
  audio: Buffer | string;

  /** Audio format */
  format?: 'wav' | 'mp3' | 'webm' | 'ogg';

  /** Language code (optional) */
  language?: string;
}

/**
 * Response from Speech-to-Text
 */
export interface STTResponse {
  /** Transcribed text */
  text: string;

  /** Confidence score (0-1) */
  confidence?: number;

  /** Processing time in ms */
  processingTime?: number;
}

/**
 * Request for Text-to-Speech
 */
export interface TTSRequest {
  /** Text to convert to speech */
  text: string;

  /** Voice to use */
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

  /** Speed (0.25 to 4.0) */
  speed?: number;

  /** Output format */
  format?: 'mp3' | 'opus' | 'aac' | 'flac';
}

/**
 * Response from Text-to-Speech
 */
export interface TTSResponse {
  /** Audio data (buffer or stream) */
  audio: Buffer;

  /** Audio format */
  format: string;

  /** Duration in seconds */
  duration?: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Standard API success response wrapper
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  timestamp: number;
}

/**
 * Standard API error response wrapper
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    statusCode: number;
  };
  timestamp: number;
}

/**
 * Union type for API responses
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

