# Quick Start Guide - Multi-Agent Interview System

## 🎯 What's New?

Your basic interview bot has been **completely transformed** into a sophisticated **multi-agent agentic system** with:

✅ **4 Specialized AI Agents** working together  
✅ **TypeScript** for type safety and better DX  
✅ **Voice I/O** (OpenAI Whisper + TTS)  
✅ **Adaptive Interview Flow** based on candidate performance  
✅ **Real-time Analytics** after each response  
✅ **Comprehensive Feedback** at the end  

---

## 🏗️ Architecture Overview

### The Multi-Agent System

```
User Answer
    ↓
┌─────────────────┐
│ Analyzer Agent  │  Evaluates response quality
└─────────────────┘
    ↓
┌─────────────────┐
│Orchestrator     │  Decides what happens next
│    Agent        │
└─────────────────┘
    ↓
┌─────────────────┐
│ Interviewer     │  Generates next question
│    Agent        │  OR hands off to Feedback
└─────────────────┘
    ↓
┌─────────────────┐
│ Feedback Agent  │  Final comprehensive evaluation
└─────────────────┘
```

### What Each Agent Does

1. **Analyzer** (`src/agents/analyzerAgent.ts`)
   - Runs after EACH user answer
   - Scores: communication, technical, behavioral, confidence, engagement
   - Detects if candidate is too chatty or too brief
   - Provides notes and suggestions

2. **Orchestrator** (`src/agents/orchestratorAgent.ts`)
   - The "brain" of the system
   - Decides: Continue? What type of question? What difficulty?
   - Adapts based on Analyzer's feedback
   - Routes to Interviewer or Feedback

3. **Interviewer** (`src/agents/interviewerAgent.ts`)
   - Generates natural, realistic questions
   - Follows Orchestrator's intent
   - Role-specific (backend, frontend, sales, etc.)
   - Sounds human, not robotic

4. **Feedback** (`src/agents/feedbackAgent.ts`)
   - Runs at end of interview
   - Analyzes full transcript
   - Provides detailed scores, strengths, weaknesses
   - Gives hiring recommendation

---

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v18+)
2. **OpenAI API Key** (required)
   - Get it here: https://platform.openai.com/api-keys
   - Used for GPT-4, Whisper, and TTS

### Installation

```bash
cd backend

# 1. Install dependencies (already done if you ran the script)
npm install

# 2. Create .env file
cat > .env << EOL
OPENAI_API_KEY=your_openai_api_key_here
PORT=9000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOL

# 3. Replace with your actual OpenAI API key
nano .env  # or use your favorite editor
```

### Running the Server

#### Development Mode (TypeScript)
```bash
npm run dev
```

#### Development with Auto-Reload
```bash
npm run dev:watch
```

#### Production Build
```bash
npm run build
npm start
```

You should see:
```
==============================================
🚀 Multi-Agent Interview Practice Partner API
==============================================
Server:      http://localhost:9000
Environment: development
Health:      http://localhost:9000/health

📋 Available Endpoints:
  POST   /api/interview/start
  POST   /api/interview/next
  ...

🤖 Agent Architecture:
  1. Orchestrator → Decides what happens next
  2. Analyzer     → Evaluates user responses
  3. Interviewer  → Generates questions
  4. Feedback     → Provides final evaluation
==============================================
```

---

## 🧪 Testing the System

### 1. Health Check

```bash
curl http://localhost:9000/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Multi-Agent Interview Practice Partner API is running",
  "architecture": "Multi-Agent (Orchestrator, Analyzer, Interviewer, Feedback)",
  "features": ["Voice I/O", "Adaptive Questioning", "Real-time Analytics", "Comprehensive Feedback"]
}
```

### 2. Start an Interview

```bash
curl -X POST http://localhost:9000/api/interview/start \
  -H "Content-Type: application/json" \
  -d '{
    "role": "backend",
    "seniority": "mid",
    "interactionMode": "chat"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "sessionId": "session_1234567890_xyz",
    "role": "backend",
    "seniority": "mid",
    "message": "Hi! I'm Sarah, and I'll be interviewing you today...",
    "phase": "opening"
  }
}
```

**Copy the `sessionId`** - you'll need it for the next steps.

### 3. Send a Response (Triggers Multi-Agent Workflow)

```bash
curl -X POST http://localhost:9000/api/interview/next \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1234567890_xyz",
    "message": "I have 5 years of experience as a backend engineer. I have worked with Node.js, Python, and PostgreSQL. I built several REST APIs and microservices for e-commerce platforms."
  }'
```

**What happens behind the scenes:**
1. Your answer is saved
2. **Analyzer Agent** evaluates it → gets scores
3. **Orchestrator Agent** decides next step → "ask technical question"
4. **Interviewer Agent** generates question → returns it

Response:
```json
{
  "success": true,
  "data": {
    "sessionId": "session_1234567890_xyz",
    "message": "That's great experience! Can you walk me through how you would design a scalable REST API for a high-traffic application?",
    "phase": "main",
    "questionCount": 2,
    "shouldEnd": false,
    "analytics": {
      "isChatty": false,
      "isTooShort": false,
      "communicationScore": 8,
      "technicalScore": 7
    }
  }
}
```

### 4. Continue Interview (Repeat Step 3)

Keep sending responses until `shouldEnd: true` (typically 7-10 questions).

### 5. Generate Feedback

```bash
curl -X POST http://localhost:9000/api/feedback/generate \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1234567890_xyz"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "sessionId": "session_1234567890_xyz",
    "role": "backend",
    "overallScore": 7,
    "scores": {
      "communication": 8,
      "technicalKnowledge": 7,
      "problemSolving": 7,
      "confidence": 8,
      "relevance": 7
    },
    "strengths": [
      "Clear and structured responses",
      "Good understanding of backend fundamentals",
      "Confident delivery"
    ],
    "improvements": [
      "Provide more specific examples with metrics",
      "Elaborate on system design trade-offs",
      "Use STAR method for behavioral questions"
    ],
    "overallFeedback": "You demonstrated solid backend engineering knowledge...",
    "recommendation": "HIRE"
  }
}
```

---

## 🎤 Testing Voice Endpoints

### Get Available Voices

```bash
curl http://localhost:9000/api/voice/voices
```

### Text-to-Speech (TTS)

```bash
curl -X POST http://localhost:9000/api/voice/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, welcome to your interview!",
    "voice": "nova"
  }' \
  --output audio.mp3

# Play the audio
open audio.mp3  # macOS
# or
mpg123 audio.mp3  # Linux
```

### Speech-to-Text (STT)

```bash
# Record audio first (or use existing audio file)
curl -X POST http://localhost:9000/api/voice/stt \
  -F "audio=@recording.wav"
```

Response:
```json
{
  "success": true,
  "data": {
    "text": "I have five years of experience in backend development",
    "confidence": 1.0,
    "processingTime": 1234
  }
}
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── agents/              # 🤖 The 4 specialized agents
│   │   ├── analyzerAgent.ts
│   │   ├── orchestratorAgent.ts
│   │   ├── interviewerAgent.ts
│   │   └── feedbackAgent.ts
│   │
│   ├── services/            # Core business logic
│   │   ├── agentWorkflow.ts # Orchestrates all agents
│   │   └── voiceService.ts  # STT/TTS
│   │
│   ├── controllers/         # HTTP request handlers
│   │   ├── interviewController.ts
│   │   ├── feedbackController.ts
│   │   └── voiceController.ts
│   │
│   ├── routes/              # API route definitions
│   │   ├── interview.ts
│   │   ├── feedback.ts
│   │   └── voice.ts
│   │
│   ├── types/               # TypeScript type definitions
│   │   └── interview.types.ts
│   │
│   └── server.ts            # Main entry point
│
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
├── MULTI_AGENT_ARCHITECTURE.md  # Detailed documentation
└── QUICKSTART.md            # This file
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```bash
# Required
OPENAI_API_KEY=sk-...

# Optional
PORT=9000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Supported Roles

- `backend` - Backend Engineer
- `frontend` - Frontend Engineer
- `fullstack` - Fullstack Engineer
- `sales` - Sales Representative
- `retail` - Retail Associate
- `product_manager` - Product Manager
- `data_analyst` - Data Analyst
- `marketing_manager` - Marketing Manager

### Seniority Levels

- `junior` - Entry level
- `mid` - Mid-level (default)
- `senior` - Senior level

---

## 🎯 Next Steps

### 1. **Connect Your Frontend**

Update your frontend to use the new endpoints:

```javascript
// Start interview
const response = await fetch('http://localhost:9000/api/interview/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    role: 'backend',
    seniority: 'mid',
    interactionMode: 'chat'
  })
});
const { sessionId, message } = await response.json().data;

// Send response
const nextResponse = await fetch('http://localhost:9000/api/interview/next', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId,
    message: userAnswer
  })
});
```

### 2. **Add Voice to Frontend**

```javascript
// Record audio from microphone
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const recorder = new MediaRecorder(stream);
// ... record audio ...

// Send to STT
const formData = new FormData();
formData.append('audio', audioBlob);
const sttResponse = await fetch('http://localhost:9000/api/voice/stt', {
  method: 'POST',
  body: formData
});
const { text } = await sttResponse.json().data;

// Send text to interview
// ... (use /api/interview/next) ...

// Get audio response
const ttsResponse = await fetch('http://localhost:9000/api/voice/tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: interviewerMessage, voice: 'nova' })
});
const audioBlob = await ttsResponse.blob();

// Play audio
const audio = new Audio(URL.createObjectURL(audioBlob));
audio.play();
```

### 3. **Customize Agent Behavior**

Edit the agent files to adjust:
- **Analyzer**: Change scoring criteria in `src/agents/analyzerAgent.ts`
- **Orchestrator**: Modify routing logic in `src/agents/orchestratorAgent.ts`
- **Interviewer**: Add new question types in `src/agents/interviewerAgent.ts`
- **Feedback**: Customize feedback format in `src/agents/feedbackAgent.ts`

### 4. **Add Persistence**

Replace in-memory storage with a database:

```typescript
// In src/services/agentWorkflow.ts
// Replace:
const activeSessions = new Map<string, InterviewState>();

// With:
import { RedisClient } from 'redis';
const redis = new RedisClient();

// Save session
await redis.set(`session:${sessionId}`, JSON.stringify(state));

// Load session
const data = await redis.get(`session:${sessionId}`);
const state = JSON.parse(data);
```

---

## 🐛 Troubleshooting

### "OPENAI_API_KEY not found"
- Make sure you have a `.env` file in the `backend/` directory
- Verify the API key starts with `sk-`
- Restart the server after adding the API key

### "Session not found"
- Sessions are in-memory and lost on server restart
- Implement Redis/MongoDB for persistent storage

### TypeScript Errors
```bash
npm run build
# Fix any errors shown
```

### Port Already in Use
```bash
# Kill process on port 9000
lsof -ti:9000 | xargs kill -9

# Or use different port
PORT=9001 npm run dev
```

---

## 📊 Performance & Cost

### Latency (per turn)
- Analyzer + Orchestrator: ~1-2 seconds
- Interviewer: ~2-3 seconds
- **Total**: ~3-5 seconds per turn

### Cost (approximate)
- Per interview (10 questions): **$0.12-0.20**
  - Agents: $0.05-0.10
  - Feedback: $0.02-0.05
  - Voice: $0.05

### Optimization Tips
- Use `gpt-4o-mini` for Analyzer/Orchestrator (fast, cheap)
- Use `gpt-4o` for Interviewer/Feedback (quality)
- Implement caching for common questions
- Use streaming TTS for better perceived latency

---

## 📚 Learn More

- **Detailed Architecture**: See `MULTI_AGENT_ARCHITECTURE.md`
- **Type Definitions**: See `src/types/interview.types.ts`
- **LangChain Docs**: https://js.langchain.com/
- **OpenAI API**: https://platform.openai.com/docs

---

## 🎉 Success!

You now have a complete **agentic multi-agent interview system** with:

✅ 4 specialized AI agents  
✅ TypeScript for type safety  
✅ Voice I/O (Whisper + TTS)  
✅ Adaptive interview flow  
✅ Real-time analytics  
✅ Comprehensive feedback  

**Your interview bot is now a sophisticated AI-powered interview coach!** 🚀

Happy interviewing! 🎤

