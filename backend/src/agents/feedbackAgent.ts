/**
 * Feedback Agent - Comprehensive Post-Interview Evaluation
 * 
 * This agent runs at the end of the interview to provide:
 * - Overall performance scores
 * - Detailed strengths and weaknesses
 * - Actionable improvement suggestions
 * - Example improved answers (optional)
 * - Hiring recommendation
 * 
 * The Feedback Agent has access to the complete interview transcript
 * and all accumulated analytics to provide thorough, specific feedback.
 */

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import type { InterviewState, FeedbackResponse } from '../types/interview.types';

/**
 * The Feedback Agent generates comprehensive interview feedback
 * 
 * @param state - Complete interview state with full history
 * @returns Detailed feedback and evaluation
 */
export async function runFeedbackAgent(
  state: InterviewState
): Promise<FeedbackResponse> {
  // Initialize the LLM (using Gemini - FREE!)
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0.5, // Balanced between consistency and natural feedback
    apiKey: process.env.GEMINI_API_KEY,
  });

  // Build the complete interview transcript
  const transcript = buildTranscript(state);
  
  // Calculate interview duration
  const duration = state.endTime 
    ? Math.round((state.endTime - state.startTime) / 1000 / 60) 
    : Math.round((Date.now() - state.startTime) / 1000 / 60);

  // Create the feedback prompt
  const feedbackPrompt = PromptTemplate.fromTemplate(`
You are an expert interview evaluator providing comprehensive feedback on a candidate's interview performance.

INTERVIEW DETAILS:
- Role: {role}
- Seniority: {seniority}
- Questions Asked: {questionCount}
- Duration: {duration} minutes

ACCUMULATED ANALYTICS:
- Average Answer Length: {avgAnswerLength} characters
- Was Chatty: {isChatty}
- Was Too Brief: {isTooShort}
- Final Communication Score: {communicationScore}/10
- Final Technical Score: {technicalScore}/10
- Final Behavioral Score: {behavioralScore}/10
- Final Confidence Score: {confidenceScore}/10
- Final Engagement Score: {engagementScore}/10

COMPLETE INTERVIEW TRANSCRIPT:
{transcript}

EVALUATION TASK:
Provide a thorough, fair, and constructive evaluation of this interview performance.

Consider:
1. **Communication**: Clarity, structure, articulation
2. **Technical Knowledge**: Depth appropriate for seniority and role
3. **Problem-Solving**: Approach to challenges, creativity
4. **Confidence**: Self-assurance without arrogance
5. **Relevance**: Staying on topic, answering what was asked
6. **STAR Structure**: For behavioral questions, did they provide Situation, Task, Action, Result?
7. **Overall Impression**: Would you recommend hiring this candidate?

Be SPECIFIC: Reference actual responses and provide concrete examples.
Be CONSTRUCTIVE: Offer actionable advice for improvement.
Be FAIR: Balance strengths and weaknesses honestly.

Return your feedback as JSON with this EXACT structure:
{{
  "overallScore": number (1-10),
  "scores": {{
    "communication": number (1-10),
    "technicalKnowledge": number (1-10),
    "problemSolving": number (1-10),
    "confidence": number (1-10),
    "relevance": number (1-10)
  }},
  "strengths": [
    "Specific strength with example from interview",
    "Another strength with example",
    "Third strength with example"
  ],
  "improvements": [
    "Specific area to improve with actionable advice",
    "Another improvement area with actionable advice",
    "Third improvement area with actionable advice"
  ],
  "highlights": [
    "Best response or moment from the interview",
    "Another highlight"
  ],
  "redFlags": [
    "Any concerning responses or patterns (empty array if none)"
  ],
  "overallFeedback": "2-3 paragraph comprehensive summary that tells a story of the interview. Be honest but encouraging. Include specific examples from their responses.",
  "recommendation": "STRONG_HIRE" | "HIRE" | "MAYBE" | "NO_HIRE"
}}

Guidelines for recommendation:
- STRONG_HIRE: 8-10 overall, excellent across the board
- HIRE: 6-8 overall, solid with minor gaps
- MAYBE: 4-6 overall, has potential but significant gaps
- NO_HIRE: 1-4 overall, not ready for this role/level

Return ONLY valid JSON.
`);

  // Format the prompt
  const formattedPrompt = await feedbackPrompt.format({
    role: state.role,
    seniority: state.seniority,
    questionCount: state.questionCount,
    duration,
    avgAnswerLength: Math.round(state.analytics.avgAnswerLength || 0),
    isChatty: state.analytics.isChatty,
    isTooShort: state.analytics.isTooShort,
    communicationScore: state.analytics.communicationScore || 'N/A',
    technicalScore: state.analytics.technicalScore || 'N/A',
    behavioralScore: state.analytics.behavioralScore || 'N/A',
    confidenceScore: state.analytics.confidenceScore || 'N/A',
    engagementScore: state.analytics.engagementScore || 'N/A',
    transcript,
  });

  // Create JSON output parser
  const parser = new JsonOutputParser();

  try {
    // Run the LLM
    const result = await model.invoke(formattedPrompt);
    
    // Parse the response
    let feedbackData: any = await parser.parse(result.content as string);
    
    // Sometimes LLMs wrap JSON in markdown code blocks, clean it
    if (typeof feedbackData === 'string') {
      feedbackData = JSON.parse(
        feedbackData.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      );
    }
    
    // Build complete feedback response
    const feedback: FeedbackResponse = {
      sessionId: state.sessionId,
      role: state.role,
      duration: `${duration} minutes`,
      questionCount: state.questionCount,
      overallScore: feedbackData.overallScore,
      scores: feedbackData.scores,
      strengths: feedbackData.strengths || [],
      improvements: feedbackData.improvements || [],
      highlights: feedbackData.highlights || [],
      redFlags: feedbackData.redFlags || [],
      overallFeedback: feedbackData.overallFeedback,
      recommendation: feedbackData.recommendation,
      generatedAt: new Date().toISOString(),
    };
    
    return feedback;
  } catch (error) {
    console.error('Feedback Agent error:', error);
    
    // Fallback: Basic feedback based on analytics
    return createFallbackFeedback(state, duration);
  }
}

/**
 * Build a readable transcript from conversation history
 */
function buildTranscript(state: InterviewState): string {
  if (state.history.length === 0) {
    return '(No conversation recorded)';
  }
  
  return state.history
    .map((msg, index) => {
      const speaker = msg.from === 'user' ? 'CANDIDATE' : 'INTERVIEWER';
      const number = Math.floor(index / 2) + 1;
      const label = msg.from === 'user' ? `A${number}` : `Q${number}`;
      return `${label} [${speaker}]: ${msg.content}`;
    })
    .join('\n\n');
}

/**
 * Fallback feedback if LLM fails
 */
function createFallbackFeedback(
  state: InterviewState,
  duration: number
): FeedbackResponse {
  const questionCount = state.questionCount;
  const analytics = state.analytics;
  
  // Calculate overall score from analytics
  const scores = [
    analytics.communicationScore || 5,
    analytics.technicalScore || 5,
    analytics.behavioralScore || 5,
    analytics.confidenceScore || 5,
    analytics.engagementScore || 5,
  ];
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const overallScore = Math.round(avgScore);
  
  // Determine recommendation
  let recommendation: FeedbackResponse['recommendation'];
  if (overallScore >= 8) recommendation = 'STRONG_HIRE';
  else if (overallScore >= 6) recommendation = 'HIRE';
  else if (overallScore >= 4) recommendation = 'MAYBE';
  else recommendation = 'NO_HIRE';
  
  // Build feedback based on analytics
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  if (questionCount >= 7) {
    strengths.push('Completed the full interview, showing commitment');
  }
  
  if (!analytics.isTooShort) {
    strengths.push('Provided detailed responses');
  }
  
  if (analytics.communicationScore && analytics.communicationScore >= 7) {
    strengths.push('Demonstrated strong communication skills');
  }
  
  if (analytics.isChatty) {
    improvements.push('Work on being more concise - aim for 1-2 minute responses');
  }
  
  if (analytics.isTooShort) {
    improvements.push('Provide more detailed examples and elaborate on your experiences');
  }
  
  if (analytics.behavioralScore && analytics.behavioralScore < 6) {
    improvements.push('Use the STAR method (Situation, Task, Action, Result) for behavioral questions');
  }
  
  return {
    sessionId: state.sessionId,
    role: state.role,
    duration: `${duration} minutes`,
    questionCount,
    overallScore,
    scores: {
      communication: analytics.communicationScore || 5,
      technicalKnowledge: analytics.technicalScore || 5,
      problemSolving: analytics.behavioralScore || 5,
      confidence: analytics.confidenceScore || 5,
      relevance: analytics.engagementScore || 5,
    },
    strengths: strengths.length > 0 ? strengths : ['Participated in the interview'],
    improvements: improvements.length > 0 ? improvements : ['Continue practicing interview skills'],
    highlights: analytics.notes.slice(-2),
    redFlags: questionCount < 5 ? ['Interview ended early'] : [],
    overallFeedback: `You completed ${questionCount} questions in ${duration} minutes. ${
      overallScore >= 6 
        ? 'Overall, you showed good understanding and communication.' 
        : 'There is room for improvement in your interview performance.'
    } Focus on providing structured, detailed responses while staying concise. Practice using the STAR method for behavioral questions.`,
    recommendation,
    generatedAt: new Date().toISOString(),
  };
}

