/**
 * Analyzer Agent - Evaluates candidate responses in real-time
 * 
 * This agent runs after each candidate answer to:
 * - Assess communication quality, technical depth, structure
 * - Detect if candidate is too chatty, too brief, or off-track
 * - Provide structured feedback that the Orchestrator uses for routing
 * 
 * The Analyzer is crucial for adaptive behavior - it enables the system
 * to adjust question difficulty, provide hints, or change topics based
 * on how the candidate is performing.
 */

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import type { InterviewState, AnalyzerResponse } from '../types/interview.types';

/**
 * The Analyzer Agent evaluates a single user response
 * 
 * @param state - Current interview state
 * @param lastAnswer - The user's most recent answer
 * @returns Structured analysis of the response
 */
export async function runAnalyzerAgent(
  state: InterviewState,
  lastAnswer: string
): Promise<AnalyzerResponse> {
  // Initialize the LLM (using Gemini - FREE!)
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0.3, // Lower temperature for more consistent analysis
    apiKey: process.env.GEMINI_API_KEY,
  });

  // Create the analysis prompt
  const analyzerPrompt = PromptTemplate.fromTemplate(`
You are an expert interview evaluator analyzing a candidate's response in a {role} interview.

CONTEXT:
- Role: {role}
- Seniority: {seniority}
- Question Count: {questionCount}
- Interview Phase: {status}

RECENT CONVERSATION:
{recentHistory}

CANDIDATE'S LAST ANSWER:
"{lastAnswer}"

ANALYSIS TASK:
Evaluate this specific answer across multiple dimensions. Be fair but critical.

Consider:
1. COMMUNICATION: Is it clear, well-structured, easy to follow?
2. TECHNICAL DEPTH: Does it show appropriate knowledge for the role/seniority?
3. BEHAVIORAL STRUCTURE: If behavioral, does it follow STAR (Situation, Task, Action, Result)?
4. CONFIDENCE: Does the candidate sound confident or uncertain?
5. ENGAGEMENT: Is the candidate engaged and thoughtful?
6. LENGTH: Is the answer appropriately detailed? Too verbose? Too brief?
7. RELEVANCE: Is the answer relevant to the question asked? Or is it off-topic?

LENGTH GUIDELINES:
- Too brief: < 50 words (likely missing details)
- Good length: 50-200 words (most answers)
- Too verbose/chatty: > 250 words (rambling, unfocused)

Return your analysis as JSON with this EXACT structure:
{{
  "isChatty": boolean (true if > 250 words or rambling),
  "isTooShort": boolean (true if < 50 words or missing key details),
  "isOffTopic": boolean (true if the answer is completely irrelevant to the question),
  "communicationScore": number (0-10, clarity and structure),
  "technicalScore": number (0-10, knowledge depth for role),
  "behavioralScore": number (0-10, STAR structure if applicable),
  "confidenceScore": number (0-10, how confident they sound),
  "engagementScore": number (0-10, enthusiasm and thoughtfulness),
  "notes": "One concise sentence summarizing this response",
  "strengths": ["specific strength 1", "specific strength 2"],
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "suggestions": ["actionable improvement 1", "actionable improvement 2"]
}}

Be specific and reference the actual answer. Return ONLY valid JSON.
`);

  // Get recent conversation history (last 3 exchanges)
  const recentHistory = state.history
    .slice(-6) // Last 3 Q&A pairs
    .map(msg => `${msg.from === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`)
    .join('\n');

  // Format the prompt
  const formattedPrompt = await analyzerPrompt.format({
    role: state.role,
    seniority: state.seniority,
    questionCount: state.questionCount,
    status: state.status,
    recentHistory: recentHistory || '(First question)',
    lastAnswer: lastAnswer,
  });

  // Create JSON output parser
  const parser = new JsonOutputParser<AnalyzerResponse>();

  try {
    // Run the LLM
    const result = await model.invoke(formattedPrompt);

    // Parse the response
    const analysis = await parser.parse(result.content as string);

    return analysis as AnalyzerResponse;
  } catch (error) {
    console.error('Analyzer Agent error:', error);

    // Fallback: Basic rule-based analysis
    return createFallbackAnalysis(lastAnswer, state);
  }
}

/**
 * Fallback analysis if LLM call fails
 * Uses simple heuristics to provide basic feedback
 */
function createFallbackAnalysis(
  answer: string,
  _state: InterviewState
): AnalyzerResponse {
  const wordCount = answer.split(/\s+/).length;
  const charCount = answer.length;

  // Determine if too chatty or too short
  const isChatty = wordCount > 250 || charCount > 1500;
  const isTooShort = wordCount < 50 || charCount < 200;

  // Basic scoring
  const baseScore = isTooShort ? 4 : isChatty ? 5 : 6;

  return {
    isChatty,
    isTooShort,
    isOffTopic: false, // Assume relevant in fallback
    communicationScore: baseScore,
    technicalScore: baseScore,
    behavioralScore: baseScore,
    confidenceScore: baseScore,
    engagementScore: baseScore,
    notes: isTooShort
      ? 'Response was quite brief and may lack necessary detail.'
      : isChatty
        ? 'Response was verbose and could be more focused.'
        : 'Response provided with reasonable detail.',
    strengths: isTooShort ? [] : ['Provided an answer'],
    weaknesses: isTooShort
      ? ['Answer too brief', 'Missing key details']
      : isChatty
        ? ['Answer too verbose', 'Could be more concise']
        : [],
    suggestions: isTooShort
      ? ['Provide more specific examples', 'Add more detail to answers']
      : isChatty
        ? ['Be more concise', 'Focus on key points']
        : ['Continue with similar level of detail'],
  };
}

/**
 * Helper function to update InterviewState analytics with new analysis
 * 
 * This updates the cumulative analytics in the interview state
 */
export function updateAnalytics(
  state: InterviewState,
  analysis: AnalyzerResponse
): InterviewState {
  // Calculate new average answer length
  const totalAnswers = state.history.filter(msg => msg.from === 'user').length;
  const currentAvg = state.analytics.avgAnswerLength || 0;
  const lastAnswerLength = state.history[state.history.length - 1]?.content.length || 0;
  const newAvg = ((currentAvg * (totalAnswers - 1)) + lastAnswerLength) / totalAnswers;

  return {
    ...state,
    analytics: {
      ...state.analytics,
      isChatty: analysis.isChatty,
      isTooShort: analysis.isTooShort,
      isOffTopic: analysis.isOffTopic,
      avgAnswerLength: newAvg,
      communicationScore: analysis.communicationScore,
      technicalScore: analysis.technicalScore,
      behavioralScore: analysis.behavioralScore,
      confidenceScore: analysis.confidenceScore,
      engagementScore: analysis.engagementScore,
      notes: [...state.analytics.notes, analysis.notes],
    },
  };
}

