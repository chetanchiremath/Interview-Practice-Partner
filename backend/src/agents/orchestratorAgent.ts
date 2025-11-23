/**
 * Orchestrator Agent - The "Brain" of the Multi-Agent System
 * 
 * This agent is responsible for:
 * - Deciding whether to continue the interview or end it
 * - Determining what type of question should come next
 * - Routing control to the appropriate agent (Interviewer or Feedback)
 * - Adapting the interview based on analytics from the Analyzer
 * 
 * The Orchestrator reads the full interview state including analytics
 * and makes strategic decisions about interview flow.
 */

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import type { InterviewState, OrchestratorResponse, AnalyzerResponse } from '../types/interview.types';

/**
 * The Orchestrator Agent decides the next step in the interview
 * 
 * @param state - Current interview state
 * @param recentAnalysis - Latest analysis from Analyzer Agent
 * @returns Decision about what to do next
 */
export async function runOrchestratorAgent(
  state: InterviewState,
  recentAnalysis: AnalyzerResponse
): Promise<OrchestratorResponse> {
  // Initialize the LLM (using Gemini - FREE!)
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0.2, // Low temperature for consistent decision-making
    apiKey: process.env.GEMINI_API_KEY,
  });

  // Create the orchestration prompt
  const orchestratorPrompt = PromptTemplate.fromTemplate(`
You are the Orchestrator of an AI interview system. Your job is to decide what should happen next in the interview.

CURRENT STATE:
- Role: {role}
- Seniority: {seniority}
- Questions Asked: {questionCount}
- Phase: {status}
- Interaction Mode: {interactionMode}

ANALYTICS FROM ANALYZER:
- Is Chatty: {isChatty}
- Is Too Short: {isTooShort}
- Is Off Topic: {isOffTopic}
- Communication Score: {communicationScore}/10
- Technical Score: {technicalScore}/10
- Behavioral Score: {behavioralScore}/10
- Confidence Score: {confidenceScore}/10
- Engagement Score: {engagementScore}/10
- Recent Notes: {recentNotes}

CONVERSATION SUMMARY:
{conversationSummary}

DECISION FRAMEWORK:

1. SHOULD WE END THE INTERVIEW?
   - End after 7-10 questions (we're at {questionCount})
   - End if candidate is clearly struggling (scores < 4 consistently)
   - End if engagement is very low
   - DO NOT end if the candidate is just off-topic. Instead, steer them back.
   
2. WHAT TYPE OF QUESTION NEXT?
   - Start with behavioral/introductory questions (questions 1-2)
   - Move to technical/role-specific questions (questions 3-6)
   - If candidate is doing well, increase difficulty
   - If candidate is struggling, provide easier questions or probe to help
   - If candidate is too brief, ask open-ended questions that require elaboration
   - If candidate is too chatty, ask more focused/specific questions
   - If candidate is OFF-TOPIC, politely acknowledge their point but steer back to the previous question or a related interview topic.
   - End with closing questions (question 7+)

3. ADAPT TO CANDIDATE:
   - Too brief → Ask "tell me more about..." or "walk me through..."
   - Too chatty → Ask "in one sentence" or specific yes/no questions
   - Low technical → Probe with hints, ask foundational questions
   - Low behavioral → Ask classic STAR questions
   - Doing well → Challenge with harder scenarios
   - Off-topic → "That's interesting, but I'd like to focus on..." or "Let's get back to..."

OUTPUT YOUR DECISION as JSON with this EXACT structure:
{{
  "nextAgent": "interviewer" | "feedback" | "end",
  "nextIntent": "ask_behavioral" | "ask_technical" | "ask_role_specific" | "probe_answer" | "ask_closing" | "end_interview" | "continue_conversation",
  "metadata": {{
    "difficulty": "easy" | "medium" | "hard",
    "focusAreas": ["area1", "area2"],
    "provideHint": boolean,
    "reasoning": "Brief explanation of why you made this decision"
  }},
  "shouldEnd": boolean
}}

Be strategic. Think about the candidate's journey and progression.
Return ONLY valid JSON.
`);

  // Build conversation summary
  const conversationSummary = state.history
    .slice(-4) // Last 2 Q&A pairs
    .map(msg => `${msg.from === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content.substring(0, 150)}...`)
    .join('\n');

  // Format the prompt
  const formattedPrompt = await orchestratorPrompt.format({
    role: state.role,
    seniority: state.seniority,
    questionCount: state.questionCount,
    status: state.status,
    interactionMode: state.interactionMode,
    isChatty: recentAnalysis.isChatty,
    isTooShort: recentAnalysis.isTooShort,
    isOffTopic: recentAnalysis.isOffTopic,
    communicationScore: recentAnalysis.communicationScore,
    technicalScore: recentAnalysis.technicalScore,
    behavioralScore: recentAnalysis.behavioralScore,
    confidenceScore: recentAnalysis.confidenceScore,
    engagementScore: recentAnalysis.engagementScore,
    recentNotes: state.analytics.notes.slice(-3).join(' | '),
    conversationSummary: conversationSummary || '(Interview just started)',
  });

  // Create JSON output parser
  const parser = new JsonOutputParser<OrchestratorResponse>();

  try {
    // Run the LLM
    const result = await model.invoke(formattedPrompt);

    // Parse the response
    const decision = await parser.parse(result.content as string);

    return decision as OrchestratorResponse;
  } catch (error) {
    console.error('Orchestrator Agent error:', error);

    // Fallback: Rule-based orchestration
    return createFallbackOrchestration(state, recentAnalysis);
  }
}

/**
 * Fallback orchestration using simple rules
 * Used if LLM call fails
 */
function createFallbackOrchestration(
  state: InterviewState,
  analysis: AnalyzerResponse
): OrchestratorResponse {
  const questionCount = state.questionCount;

  // Determine if we should end
  const shouldEnd = questionCount >= 8;

  if (shouldEnd) {
    return {
      nextAgent: 'feedback',
      nextIntent: 'end_interview',
      metadata: {
        reasoning: 'Interview completed with sufficient questions',
      },
      shouldEnd: true,
    };
  }

  // Handle off-topic in fallback
  if (analysis.isOffTopic) {
    return {
      nextAgent: 'interviewer',
      nextIntent: 'continue_conversation',
      metadata: {
        difficulty: 'medium',
        focusAreas: ['Steer back to topic'],
        provideHint: false,
        reasoning: 'Candidate went off-topic, steering back',
      },
      shouldEnd: false,
    };
  }

  // Determine next intent based on question count
  let nextIntent: OrchestratorResponse['nextIntent'];
  let difficulty: 'easy' | 'medium' | 'hard' = 'medium';

  if (questionCount <= 2) {
    nextIntent = 'ask_behavioral';
    difficulty = 'easy';
  } else if (questionCount <= 5) {
    nextIntent = 'ask_role_specific';
    difficulty = analysis.technicalScore > 7 ? 'hard' : 'medium';
  } else {
    nextIntent = 'ask_closing';
    difficulty = 'easy';
  }

  // Adapt based on analytics
  const focusAreas: string[] = [];
  if (analysis.isTooShort) {
    focusAreas.push('Ask open-ended questions requiring elaboration');
  }
  if (analysis.isChatty) {
    focusAreas.push('Ask focused, specific questions');
  }
  if (analysis.technicalScore < 5) {
    focusAreas.push('Provide easier technical questions with hints');
  }

  return {
    nextAgent: 'interviewer',
    nextIntent,
    metadata: {
      difficulty,
      focusAreas: focusAreas.length > 0 ? focusAreas : ['Continue naturally'],
      provideHint: analysis.technicalScore < 4,
      reasoning: `Question ${questionCount + 1}: Following standard interview progression`,
    },
    shouldEnd: false,
  };
}

