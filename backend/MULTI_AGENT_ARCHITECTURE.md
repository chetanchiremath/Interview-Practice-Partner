# Multi-Agent Interview System - Architecture Documentation

## Overview

This is a complete **agentic multi-agent interview coaching system** built with TypeScript, Express, LangChain, and OpenAI. The system uses multiple cooperating AI agents to conduct realistic, adaptive mock interviews with voice support.

## Architecture

### Multi-Agent System

The system consists of 4 specialized agents that work together:

```
User Answer → Analyzer → Orchestrator → Interviewer/Feedback → User
                ↓            ↓              ↓
            Analytics    Decisions    Next Question
```

#### 1. **Analyzer Agent** (`src/agents/analyzerAgent.ts`)
- **Role**: Evaluates each user response in real-time
- **Input**: User's answer + conversation history
- **Output**: Structured analysis with scores and feedback
- **Evaluates**:
  - Communication quality (0-10)
  - Technical depth (0-10)
  - Behavioral structure (STAR method) (0-10)
  - Confidence level (0-10)
  - Engagement (0-10)
  - Whether candidate is too chatty or too brief
- **Model**: GPT-4o-mini (fast, cost-effective)
- **Purpose**: Provides real-time analytics that guide the Orchestrator's decisions

#### 2. **Orchestrator Agent** (`src/agents/orchestratorAgent.ts`)
- **Role**: The "brain" that decides what happens next
- **Input**: Interview state + Analyzer's feedback
- **Output**: Decision about next action
- **Decides**:
  - Should we continue or end the interview?
  - What type of question should come next? (behavioral, technical, role-specific, etc.)
  - Should we increase/decrease difficulty?
  - Should we provide hints?
- **Model**: GPT-4o-mini
- **Purpose**: Adaptive routing - adjusts interview flow based on candidate performance

#### 3. **Interviewer Agent** (`src/agents/interviewerAgent.ts`)
- **Role**: Generates realistic interview questions
- **Input**: Interview state + Orchestrator's intent
- **Output**: Natural, human-like question
- **Generates**:
  - Role-specific questions (backend, frontend, sales, etc.)
  - Behavioral questions (STAR format)
  - Technical questions
  - Follow-up probes
  - Closing questions
- **Model**: GPT-4o (high quality for natural conversations)
- **Purpose**: Sounds like a real human interviewer, not a bot

#### 4. **Feedback Agent** (`src/agents/feedbackAgent.ts`)
- **Role**: Comprehensive post-interview evaluation
- **Input**: Complete interview transcript + analytics
- **Output**: Detailed feedback report
- **Provides**:
  - Overall score (1-10)
  - Breakdown scores (communication, technical, problem-solving, confidence, relevance)
  - Specific strengths with examples
  - Areas for improvement with actionable advice
  - Interview highlights
  - Red flags (if any)
  - Hiring recommendation (STRONG_HIRE, HIRE, MAYBE, NO_HIRE)
- **Model**: GPT-4o (high quality for nuanced feedback)
- **Purpose**: Helps candidates understand their performance and improve

### Workflow Orchestration

The `agentWorkflow.ts` service coordinates all agents:

1. **Session Initialization**
   ```typescript
   initializeInterviewSession(sessionId, role, seniority, interactionMode)
   ```
   - Creates interview state
   - Generates opening question
   - Returns session details

2. **Processing User Responses**
   ```typescript
   processUserResponse(sessionId, userMessage)
   ```
   - Adds user answer to history
   - Runs Analyzer Agent → gets real-time feedback
   - Runs Orchestrator Agent → decides next step
   - Runs Interviewer Agent (or ends interview)
   - Updates state and returns next question

3. **Feedback Generation**
   ```typescript
   generateInterviewFeedback(sessionId)
   ```
   - Runs Feedback Agent on complete transcript
   - Returns comprehensive evaluation
   - Cleans up session

## Voice I/O

### Speech-to-Text (STT)
- **Service**: `src/services/voiceService.ts`
- **API**: OpenAI Whisper
- **Endpoint**: `POST /api/voice/stt`
- **Supports**: Multiple audio formats (webm, mp3, wav, etc.)
- **Features**:
  - High-quality transcription
  - Multi-language support
  - Fast processing

### Text-to-Speech (TTS)
- **Service**: `src/services/voiceService.ts`
- **API**: OpenAI TTS
- **Endpoints**:
  - `POST /api/voice/tts` - Returns audio buffer
  - `POST /api/voice/tts-stream` - Streaming audio (better UX)
- **Voices**: 6 options (alloy, echo, fable, onyx, nova, shimmer)
- **Recommended for interviews**: `nova` (friendly and energetic)

## Type System

All types are defined in `src/types/interview.types.ts`:

### Core Types

- **InterviewState**: Complete state of an interview session
  - Session info (id, role, seniority)
  - Conversation history
  - Real-time analytics
  - Metadata

- **AnalyzerResponse**: Output from Analyzer Agent
- **OrchestratorResponse**: Output from Orchestrator Agent
- **InterviewerResponse**: Output from Interviewer Agent
- **FeedbackResponse**: Output from Feedback Agent

### API Types

- **StartInterviewRequest/Response**
- **SendResponseRequest/Response**
- **GenerateFeedbackRequest**
- **STTRequest/Response**
- **TTSRequest/Response**

All API responses follow this format:
```typescript
{
  success: boolean,
  data: T,
  message?: string,
  timestamp: number
}
```

## API Endpoints

### Interview Endpoints

- **POST `/api/interview/start`**
  - Start a new interview session
  - Body: `{ role, seniority?, interactionMode? }`
  - Returns: Session ID and opening question

- **POST `/api/interview/next`**
  - Send user response, triggers multi-agent workflow
  - Body: `{ sessionId, message }`
  - Returns: Next question and analytics

- **GET `/api/interview/session/:sessionId`**
  - Get current session information
  - Returns: Session metadata

- **POST `/api/interview/end`**
  - End an interview session
  - Body: `{ sessionId }`

### Feedback Endpoints

- **POST `/api/feedback/generate`**
  - Generate comprehensive feedback
  - Body: `{ sessionId, quick? }`
  - Returns: Detailed evaluation report

- **GET `/api/feedback/roles`**
  - Get available roles

### Voice Endpoints

- **POST `/api/voice/stt`**
  - Convert speech to text
  - Body: Audio file or base64
  - Returns: Transcribed text

- **POST `/api/voice/tts`**
  - Convert text to speech
  - Body: `{ text, voice?, speed?, format? }`
  - Returns: Audio buffer

- **POST `/api/voice/tts-stream`**
  - Streaming TTS (better for long text)
  - Returns: Audio stream

- **GET `/api/voice/voices`**
  - Get available TTS voices

## Environment Variables

Create a `.env` file in the backend directory:

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional
PORT=9000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Get OpenAI API Key**: https://platform.openai.com/api-keys

## Running the Server

### Development (TypeScript)
```bash
npm run dev
# or with auto-reload
npm run dev:watch
```

### Production Build
```bash
npm run build
npm start
```

### Old JavaScript Version (fallback)
```bash
npm run start:old
```

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express
- **AI**: LangChain.js + OpenAI
- **Models**:
  - GPT-4o (Interviewer, Feedback) - High quality
  - GPT-4o-mini (Analyzer, Orchestrator) - Fast & cost-effective
  - Whisper (STT)
  - TTS-1 (Text-to-speech)

## Key Features

### 1. Adaptive Interview Flow
The Orchestrator adapts based on candidate performance:
- **Too brief answers** → Asks more open-ended questions
- **Too chatty** → Asks focused, specific questions
- **Struggling technically** → Provides easier questions with hints
- **Doing well** → Increases difficulty

### 2. Real-time Analytics
After each answer, the Analyzer provides:
- Communication score
- Technical score
- Behavioral score
- Confidence level
- Engagement level
- Notes and suggestions

### 3. Role-Specific Interviews
Supported roles:
- Backend Engineer
- Frontend Engineer
- Fullstack Engineer
- Sales Representative
- Retail Associate
- Product Manager
- Data Analyst
- Marketing Manager

Each role has specialized questions and evaluation criteria.

### 4. Voice Support
- Natural voice interactions using OpenAI TTS
- High-quality speech recognition with Whisper
- Multiple voice options
- Streaming support for better UX

### 5. Comprehensive Feedback
End-of-interview feedback includes:
- Overall performance score
- Detailed score breakdown
- Specific strengths with examples
- Actionable improvement suggestions
- Interview highlights
- Hiring recommendation

## Data Flow Example

```
1. User starts interview → /api/interview/start
   ↓
2. System generates opening question (no agents needed yet)
   ↓
3. User answers (voice or text) → /api/interview/next
   ↓
4. ANALYZER evaluates answer → scores + analysis
   ↓
5. ORCHESTRATOR decides next step → "ask technical question, medium difficulty"
   ↓
6. INTERVIEWER generates question → "Can you explain how REST APIs work?"
   ↓
7. User answers → back to step 3
   ↓
8. After 7-10 questions, ORCHESTRATOR decides to end
   ↓
9. User requests feedback → /api/feedback/generate
   ↓
10. FEEDBACK AGENT analyzes full transcript → comprehensive report
```

## Session Storage

Currently uses in-memory Map (simple, good for development).

**For production**, replace with:
- **Redis**: Fast, good for sessions
- **MongoDB**: Document-based, flexible
- **PostgreSQL**: Relational, structured

To add persistence:
1. Update `src/services/agentWorkflow.ts`
2. Replace `Map` with database client
3. Implement save/load methods

## Testing the System

### 1. Start the server
```bash
npm run dev
```

### 2. Test interview flow
```bash
# Start interview
curl -X POST http://localhost:9000/api/interview/start \
  -H "Content-Type: application/json" \
  -d '{"role": "backend", "seniority": "mid"}'

# Send response (copy sessionId from above)
curl -X POST http://localhost:9000/api/interview/next \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "session_...", "message": "I have 5 years of experience..."}'

# Generate feedback
curl -X POST http://localhost:9000/api/feedback/generate \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "session_..."}'
```

### 3. Test voice endpoints
```bash
# Get available voices
curl http://localhost:9000/api/voice/voices

# Convert text to speech
curl -X POST http://localhost:9000/api/voice/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, welcome to your interview!", "voice": "nova"}' \
  --output audio.mp3
```

## Extending the System

### Add a New Role
1. Add role to `Role` type in `src/types/interview.types.ts`
2. Add role context in `getRoleContext()` in `src/agents/interviewerAgent.ts`
3. Add role to validation in `src/controllers/interviewController.ts`

### Add a New Agent
1. Create agent file in `src/agents/`
2. Define input/output types in `src/types/interview.types.ts`
3. Add agent to workflow in `src/services/agentWorkflow.ts`
4. Update Orchestrator to route to new agent

### Add Database Persistence
1. Install database client (e.g., `pg` for PostgreSQL)
2. Create database schema
3. Replace `Map` in `agentWorkflow.ts` with DB operations
4. Add connection pooling and error handling

## Performance Considerations

- **Analyzer + Orchestrator**: ~1-2 seconds (GPT-4o-mini is fast)
- **Interviewer**: ~2-3 seconds (GPT-4o for quality)
- **Feedback**: ~5-10 seconds (analyzes full transcript)
- **STT**: ~1-2 seconds (Whisper is fast)
- **TTS**: ~1-2 seconds (or streaming for instant start)

**Cost per interview** (approximate):
- 10 questions × (Analyzer + Orchestrator + Interviewer) ≈ $0.05-0.10
- Feedback: ≈ $0.02-0.05
- Voice (10 questions): ≈ $0.05
- **Total**: ~$0.12-0.20 per complete interview

## Troubleshooting

### "Session not found" error
- Sessions are in-memory, lost on server restart
- Implement persistent storage for production

### Agent timeouts
- Check OpenAI API key
- Check network connectivity
- Increase timeout in LangChain model config

### Voice not working
- Verify audio format is supported
- Check file size (max 25MB for Whisper)
- Ensure OpenAI API key has access to voice models

### TypeScript errors
```bash
npm run build
# Fix any type errors shown
```

## Future Enhancements

- [ ] Add LangGraph for visual workflow management
- [ ] Implement conversation memory (remember previous sessions)
- [ ] Add realtime voice streaming (WebSocket-based)
- [ ] Support video interviews (analyze body language)
- [ ] Add resume parsing and analysis
- [ ] Implement interview scheduling
- [ ] Add user authentication
- [ ] Create admin dashboard for analytics
- [ ] Support multiple languages
- [ ] Add custom interview templates

## License

MIT

## Support

For questions or issues, please open a GitHub issue or contact the maintainers.

