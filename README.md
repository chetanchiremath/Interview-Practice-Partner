# 🎯 AI Interview Practice Partner

> **An intelligent, multi-agent AI interview platform powered by Google Gemini and LangChain**

[![Tech Stack](https://img.shields.io/badge/Stack-TypeScript%20%7C%20Next.js%20%7C%20Gemini%20%7C%20LangChain-blue)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Cost](https://img.shields.io/badge/Cost-100%25%20FREE-brightgreen)](https://makersuite.google.com/app/apikey)
[![Version](https://img.shields.io/badge/Version-2.0-orange)](https://github.com)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [API Documentation](#-api-documentation)
- [Multi-Agent System](#-multi-agent-system)
- [Design Decisions](#-design-decisions)
- [Voice Features](#-voice-features)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Overview

**Interview Practice Partner** is a sophisticated AI-powered mock interview platform that simulates realistic job interviews using a **multi-agent architecture**. The system intelligently adapts to candidates, provides real-time analytics, and delivers comprehensive feedback to help job seekers improve their interview skills.

### 🆓 100% FREE - No API Costs!

This project leverages:
- ✅ **Google Gemini 2.5 Flash** - FREE with generous limits (60 requests/minute)
- ✅ **Browser Web Speech API** - Built-in Speech-to-Text (FREE)
- ✅ **Browser Speech Synthesis** - Built-in Text-to-Speech (FREE)
- ✅ **LangChain** - Open-source agent orchestration framework

**No credit card required! No hidden costs!**

### 🌟 Key Capabilities

✅ **Multi-Agent Intelligence** - Orchestrator, Analyzer, Interviewer, and Feedback agents work together  
✅ **Adaptive Questioning** - AI adjusts difficulty and style based on candidate performance  
✅ **Real-Time Analytics** - Continuous evaluation of communication, technical skills, and engagement  
✅ **Role-Specific Interviews** - Tailored questions for Software Engineers, Product Managers, Sales, and more  
✅ **Voice & Chat Modes** - Flexible interaction options for different practice scenarios  
✅ **Comprehensive Feedback** - Detailed post-interview analysis with actionable insights  

---

## ✨ Features

### 1. **Multi-Agent Architecture** 🤖

The system uses **four specialized AI agents** that collaborate to create a realistic interview experience:

- **🧠 Orchestrator Agent**: Decides interview flow and next steps
- **📊 Analyzer Agent**: Evaluates responses in real-time
- **💼 Interviewer Agent**: Generates contextual questions
- **📝 Feedback Agent**: Provides comprehensive post-interview evaluation

### 2. **Intelligent Adaptation** 🎯

The AI automatically detects and adapts to:
- **Response Length**: Adjusts question style for chatty or brief candidates
- **Technical Depth**: Increases/decreases difficulty based on performance
- **Off-Topic Responses**: Gently steers conversation back on track
- **Confidence Levels**: Provides hints or challenges as appropriate

### 3. **Real-Time Analytics** 📈

Continuous evaluation across multiple dimensions:
- **Communication Score** (1-10)
- **Technical Knowledge** (1-10)
- **Behavioral Skills** (1-10)
- **Confidence Level** (1-10)
- **Engagement Score** (1-10)

### 4. **Voice & Chat Modes** 🎤💬

- **Voice Mode**: Practice speaking skills with real-time speech recognition
- **Chat Mode**: Craft thoughtful written responses
- Seamless switching between modes

### 5. **Comprehensive Feedback** 📊

Post-interview analysis includes:
- Overall performance score
- Category-wise breakdown
- Specific strengths with examples
- Areas for improvement with actionable advice
- Interview highlights
- Hiring recommendation (Strong Hire / Hire / Maybe / No Hire)

### 6. **Role-Specific Interviews** 💼

Specialized question sets for:
- Software Engineer
- Product Manager
- Data Scientist
- Sales Representative
- Marketing Manager
- Customer Success Manager

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 14)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Landing Page │  │  Interview   │  │   Feedback   │         │
│  │              │  │   Interface  │  │   Dashboard  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                 │
│         └──────────────────┼──────────────────┘                 │
│                            │ REST API                           │
└────────────────────────────┼────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                    BACKEND (Express + TypeScript)               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              MULTI-AGENT WORKFLOW SERVICE                │  │
│  │                                                          │  │
│  │  ┌────────────┐    ┌────────────┐    ┌────────────┐   │  │
│  │  │Orchestrator│───▶│  Analyzer  │───▶│Interviewer │   │  │
│  │  │   Agent    │    │   Agent    │    │   Agent    │   │  │
│  │  └────────────┘    └────────────┘    └────────────┘   │  │
│  │         │                                      │        │  │
│  │         └──────────────────┬───────────────────┘        │  │
│  │                            │                            │  │
│  │                     ┌────────────┐                      │  │
│  │                     │  Feedback  │                      │  │
│  │                     │   Agent    │                      │  │
│  │                     └────────────┘                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                   │
│                            ▼                                   │
│                  ┌──────────────────┐                          │
│                  │  Google Gemini   │                          │
│                  │  2.5 Flash API   │                          │
│                  │   (FREE!)        │                          │
│                  └──────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

### Multi-Agent Workflow

```
User Answer
    │
    ▼
┌─────────────────┐
│ Analyzer Agent  │ ──▶ Evaluates response quality
└─────────────────┘     Detects patterns (chatty, brief, off-topic)
    │                   Scores: communication, technical, behavioral
    ▼
┌─────────────────┐
│Orchestrator     │ ──▶ Decides: continue or end interview?
│Agent            │     Determines next question type
└─────────────────┘     Adapts difficulty based on performance
    │
    ▼
┌─────────────────┐
│Interviewer Agent│ ──▶ Generates contextual question
│  OR             │     Considers role, seniority, history
│Feedback Agent   │     Provides hints if struggling
└─────────────────┘
    │
    ▼
Next Question / Final Feedback
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **AI Model**: Google Gemini 2.5 Flash (FREE!)
- **Agent Framework**: LangChain + LangGraph
- **Voice Processing**: Browser Web Speech API (client-side)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript/React
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Voice I/O**: Web Speech API + Speech Synthesis API

### AI & ML
- **LLM**: Google Gemini 2.5 Flash via `@langchain/google-genai`
- **Orchestration**: LangChain Core + LangGraph
- **Prompt Engineering**: Custom role-based and adaptive prompts
- **Output Parsing**: Structured JSON responses

---

## 📁 Project Structure

```
interview-practice-partner/
├── backend/
│   ├── src/
│   │   ├── agents/                      # Multi-Agent System
│   │   │   ├── orchestratorAgent.ts     # Decides interview flow
│   │   │   ├── analyzerAgent.ts         # Evaluates responses
│   │   │   ├── interviewerAgent.ts      # Generates questions
│   │   │   └── feedbackAgent.ts         # Creates final feedback
│   │   │
│   │   ├── services/
│   │   │   ├── agentWorkflow.ts         # Orchestrates agent collaboration
│   │   │   └── voiceService.ts          # Voice processing utilities
│   │   │
│   │   ├── controllers/
│   │   │   ├── interviewController.ts   # Interview API handlers
│   │   │   ├── feedbackController.ts    # Feedback API handlers
│   │   │   └── voiceController.ts       # Voice API handlers
│   │   │
│   │   ├── routes/
│   │   │   ├── interview.ts             # Interview endpoints
│   │   │   ├── feedback.ts              # Feedback endpoints
│   │   │   └── voice.ts                 # Voice endpoints
│   │   │
│   │   ├── types/
│   │   │   └── interview.types.ts       # TypeScript type definitions
│   │   │
│   │   └── server.ts                    # Express server entry point
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                             # Environment variables
│
├── frontend/
│   ├── app/
│   │   ├── page.js                      # Landing page (role selection)
│   │   ├── layout.js                    # Root layout
│   │   ├── globals.css                  # Global styles + Tailwind
│   │   ├── interview/
│   │   │   └── page.js                  # Interview interface
│   │   └── feedback/
│   │       └── page.js                  # Feedback display
│   │
│   ├── components/
│   │   ├── RoleSelector.jsx             # Job role selection cards
│   │   ├── VoiceInterface.jsx           # Voice mode UI
│   │   ├── ChatInterface.jsx            # Chat mode UI
│   │   └── FeedbackDashboard.jsx        # Feedback visualization
│   │
│   ├── lib/
│   │   └── api.js                       # Axios API client
│   │
│   ├── tailwind.config.js               # Tailwind configuration
│   ├── package.json
│   └── .env.local                       # Frontend environment variables
│
├── README.md                            # This file
├── ARCHITECTURE_EXPLAINED.md            # Detailed architecture guide
├── .gitignore
└── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google Gemini API Key** - [Get FREE key here](https://makersuite.google.com/app/apikey)

### Step 1: Get Your FREE Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy your API key (starts with `AIza...`)

**No credit card required! Completely FREE!**

### Step 2: Clone the Repository

```bash
git clone <repository-url>
cd interview-practice-partner
```

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=9000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
EOF
```

**⚠️ Important**: Edit `.env` and replace `your_gemini_api_key_here` with your actual Gemini API key.

### Step 4: Start Backend Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm run build
npm start
```

Backend runs on **`http://localhost:9000`**

You should see:
```
🚀 Multi-Agent Interview Practice Partner API
Server:      http://localhost:9000
Environment: development
Health:      http://localhost:9000/health
```

### Step 5: Frontend Setup

**Open a NEW terminal window:**

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:9000" > .env.local

# Start development server
npm run dev
```

Frontend runs on **`http://localhost:3000`**

### Step 6: Open in Browser

```
http://localhost:3000
```

**🎉 You're ready to practice!**

---

## 📡 API Documentation

### Base URL
```
http://localhost:9000/api
```

### Endpoints

#### **1. Start Interview**
```http
POST /interview/start
Content-Type: application/json

{
  "role": "SOFTWARE_ENGINEER",
  "seniority": "mid",
  "interactionMode": "chat"
}

Response:
{
  "success": true,
  "data": {
    "sessionId": "session_abc123",
    "message": "Hello! I'm excited to interview you today...",
    "role": "SOFTWARE_ENGINEER",
    "seniority": "mid"
  }
}
```

#### **2. Send Response (Triggers Multi-Agent Workflow)**
```http
POST /interview/next
Content-Type: application/json

{
  "sessionId": "session_abc123",
  "message": "I have 5 years of experience in full-stack development..."
}

Response:
{
  "success": true,
  "data": {
    "message": "That's great! Can you tell me about a challenging project...",
    "shouldEnd": false,
    "phase": "main",
    "questionCount": 3,
    "analytics": {
      "communicationScore": 8,
      "technicalScore": 7
    }
  }
}
```

#### **3. Generate Feedback**
```http
POST /feedback/generate
Content-Type: application/json

{
  "sessionId": "session_abc123"
}

Response:
{
  "success": true,
  "data": {
    "overallScore": 8,
    "scores": {
      "communication": 9,
      "technicalKnowledge": 7,
      "behavioralSkills": 8,
      "confidence": 8,
      "engagement": 9
    },
    "strengths": ["Clear communication", "Good examples"],
    "improvements": ["More technical depth needed"],
    "recommendation": "HIRE"
  }
}
```

#### **4. Get Available Roles**
```http
GET /feedback/roles

Response:
{
  "success": true,
  "data": [
    {
      "id": "SOFTWARE_ENGINEER",
      "name": "Software Engineer",
      "description": "Full-stack development role"
    },
    ...
  ]
}
```

#### **5. Voice Endpoints**
```http
POST /voice/stt          # Speech-to-text (browser-based recommended)
POST /voice/tts          # Text-to-speech (browser-based recommended)
GET  /voice/voices       # Get available TTS voices
```

---

## 🤖 Multi-Agent System

### Agent Responsibilities

#### 1. **Orchestrator Agent** 🧠
**Purpose**: Strategic decision-making

**Responsibilities**:
- Decides whether to continue or end the interview
- Determines the type of next question (behavioral, technical, role-specific)
- Adjusts difficulty based on candidate performance
- Routes control to appropriate agent

**Decision Factors**:
- Question count (7-10 questions total)
- Candidate performance scores
- Response patterns (chatty, brief, off-topic)
- Interview phase (opening, main, closing)

**Example Decision**:
```json
{
  "nextAgent": "interviewer",
  "nextIntent": "ask_technical",
  "metadata": {
    "difficulty": "hard",
    "focusAreas": ["System design", "Scalability"],
    "provideHint": false,
    "reasoning": "Candidate performing well, increasing difficulty"
  },
  "shouldEnd": false
}
```

#### 2. **Analyzer Agent** 📊
**Purpose**: Real-time response evaluation

**Responsibilities**:
- Analyzes response quality and depth
- Detects communication patterns
- Scores across multiple dimensions
- Identifies strengths and weaknesses

**Evaluation Criteria**:
- **Communication**: Clarity, structure, articulation
- **Technical Knowledge**: Depth, accuracy, relevance
- **Behavioral Skills**: STAR method, examples, self-awareness
- **Confidence**: Assertiveness, composure, conviction
- **Engagement**: Enthusiasm, interest, energy

**Example Analysis**:
```json
{
  "isChatty": false,
  "isTooShort": false,
  "isOffTopic": false,
  "communicationScore": 8,
  "technicalScore": 7,
  "behavioralScore": 8,
  "confidenceScore": 9,
  "engagementScore": 8,
  "notes": "Strong answer with concrete examples",
  "strengths": ["Used STAR method", "Specific metrics"],
  "weaknesses": ["Could elaborate on technical details"]
}
```

#### 3. **Interviewer Agent** 💼
**Purpose**: Generate contextual questions

**Responsibilities**:
- Creates role-specific questions
- Adapts to candidate's seniority level
- Considers conversation history
- Provides hints when candidate struggles
- Steers back on track if off-topic

**Question Types**:
- `ask_behavioral`: STAR-method questions
- `ask_technical`: Role-specific technical questions
- `ask_role_specific`: Job-specific scenarios
- `probe_answer`: Follow-up for clarification
- `ask_closing`: Wrap-up questions
- `continue_conversation`: Redirect if off-topic

**Example Question**:
```json
{
  "message": "Tell me about a time when you had to debug a complex production issue. How did you approach it?",
  "questionType": "ask_technical"
}
```

#### 4. **Feedback Agent** 📝
**Purpose**: Comprehensive post-interview evaluation

**Responsibilities**:
- Analyzes entire interview conversation
- Generates detailed feedback report
- Provides hiring recommendation
- Offers actionable improvement suggestions

**Feedback Structure**:
```json
{
  "overallScore": 8,
  "scores": {
    "communication": 9,
    "technicalKnowledge": 7,
    "behavioralSkills": 8,
    "confidence": 8,
    "engagement": 9
  },
  "strengths": [
    "Excellent communication with clear structure",
    "Provided specific examples with measurable outcomes"
  ],
  "improvements": [
    "Dive deeper into technical architecture decisions",
    "Discuss trade-offs more explicitly"
  ],
  "highlights": [
    "Outstanding answer about leading the migration project"
  ],
  "recommendation": "HIRE",
  "summary": "Strong candidate with excellent communication..."
}
```

---

## 🎨 Design Decisions

### 1. **Why Multi-Agent Architecture?**

**Decision**: Use specialized agents instead of a monolithic AI

**Reasoning**:
- ✅ **Separation of Concerns**: Each agent has a clear, focused responsibility
- ✅ **Better Performance**: Specialized prompts yield better results than one-size-fits-all
- ✅ **Easier Debugging**: Can test and improve each agent independently
- ✅ **Scalability**: Easy to add new agents (e.g., domain expert agent)
- ✅ **Flexibility**: Can swap out individual agents without affecting others

**Trade-offs**:
- ⚠️ More API calls (but Gemini is free!)
- ⚠️ Slightly higher latency (mitigated by fast Gemini 2.5 Flash)

### 2. **Why Google Gemini Instead of OpenAI?**

**Decision**: Use Google Gemini 2.5 Flash

**Reasoning**:
- ✅ **100% FREE** - No credit card required
- ✅ **Generous Limits** - 60 requests/minute
- ✅ **High Quality** - Comparable to GPT-4
- ✅ **Fast** - Gemini 2.5 Flash is optimized for speed
- ✅ **Easy Integration** - LangChain has excellent Gemini support

**Cost Comparison**:
- **Gemini**: $0.00 per interview
- **OpenAI GPT-4**: ~$0.50-$1.00 per interview

### 3. **Why LangChain?**

**Decision**: Use LangChain for agent orchestration

**Reasoning**:
- ✅ **Agent Framework**: Built-in support for multi-agent systems
- ✅ **Prompt Templates**: Easy to manage and version prompts
- ✅ **Output Parsing**: Structured JSON responses with validation
- ✅ **Provider Agnostic**: Easy to switch between Gemini, OpenAI, etc.
- ✅ **Community**: Large ecosystem and active development

### 4. **Why Browser-Based Voice?**

**Decision**: Use Web Speech API and Speech Synthesis API

**Reasoning**:
- ✅ **100% FREE** - No API costs
- ✅ **No Server Processing** - Reduces backend load
- ✅ **Low Latency** - Processes locally
- ✅ **Privacy** - Audio doesn't leave user's device
- ✅ **Built-in** - Available in all modern browsers

**Drawbacks**:
- ⚠️ Requires Chrome, Edge, or Safari
- ⚠️ Voice quality varies by browser

**Alternative**: For production, consider Google Cloud Speech-to-Text (free tier: 60 min/month)

### 5. **Why TypeScript for Backend?**

**Decision**: Use TypeScript instead of JavaScript

**Reasoning**:
- ✅ **Type Safety**: Catch errors at compile time
- ✅ **Better IDE Support**: Autocomplete and refactoring
- ✅ **Self-Documenting**: Types serve as documentation
- ✅ **Easier Refactoring**: Confidence when making changes
- ✅ **Agent Interfaces**: Strongly typed agent responses

### 6. **Why In-Memory Session Storage?**

**Decision**: Store sessions in-memory (Map)

**Reasoning**:
- ✅ **Simple for MVP**: No database setup required
- ✅ **Fast Access**: Instant read/write
- ✅ **Easy to Migrate**: Can switch to Redis/MongoDB later

**Production Recommendation**: Use Redis for session storage

---

## 🎤 Voice Features

### Speech-to-Text (STT)

**Current Implementation**: Browser Web Speech API (client-side)

**How it works**:
1. User clicks microphone button
2. Browser requests microphone permission
3. `MediaRecorder` API captures audio
4. Web Speech API transcribes in real-time
5. Transcription sent to backend as text

**Browser Support**:
- ✅ Chrome (best support)
- ✅ Edge
- ✅ Safari
- ⚠️ Firefox (limited support)

**Alternative**: For server-side STT, use Google Cloud Speech-to-Text (free tier: 60 min/month)

### Text-to-Speech (TTS)

**Current Implementation**: Browser Speech Synthesis API (client-side)

**How it works**:
1. Backend sends text response
2. Frontend uses `speechSynthesis.speak()`
3. Browser plays audio using built-in voices

**Voice Options**:
- Multiple voices per browser
- Adjustable rate, pitch, volume
- Language support varies by OS

**Alternative**: For server-side TTS, use Google Cloud Text-to-Speech (free tier: 0-4M chars/month)

### Voice Interface Features

- 🎙️ **Visual Feedback**: Pulsing animation while recording
- 🔴 **Recording Indicator**: Clear visual state
- 📝 **Live Transcription**: See what was heard
- 🔊 **Audio Playback**: Hear AI responses
- ⏸️ **Pause/Resume**: Control interview flow

---

## 🚀 Deployment

### Backend Deployment (Railway / Render)

1. **Create account** on [Railway](https://railway.app) or [Render](https://render.com)

2. **Connect GitHub repository**

3. **Set environment variables**:
   ```
   PORT=9000
   NODE_ENV=production
   GEMINI_API_KEY=your_gemini_api_key
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Build command**: `npm run build`

5. **Start command**: `npm start`

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel deploy --prod
   ```

3. **Set environment variable**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```

### Docker Deployment (Optional)

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 9000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "9000:9000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:9000
```

---

## 🐛 Troubleshooting

### Backend Issues

#### **"Missing required environment variable: GEMINI_API_KEY"**
**Solution**: Create `.env` file in `backend/` with your Gemini API key:
```bash
GEMINI_API_KEY=your_key_here
```

#### **"Port 9000 is already in use"**
**Solution**: Kill the process or use a different port:
```bash
# Kill process on port 9000
lsof -ti:9000 | xargs kill -9

# Or use different port
PORT=9001 npm run dev
```

#### **"Failed to generate response"**
**Solution**: Check your Gemini API key is valid and has quota remaining

### Frontend Issues

#### **"Failed to fetch roles"**
**Solution**: Ensure backend is running on `http://localhost:9000`

#### **"Network Error"**
**Solution**: Check `.env.local` has correct backend URL:
```
NEXT_PUBLIC_API_URL=http://localhost:9000
```

### Voice Issues

#### **"Speech recognition not supported"**
**Solution**: Use Chrome, Edge, or Safari (not Firefox)

#### **"Microphone permission denied"**
**Solution**: Allow microphone access in browser settings

#### **"Voice not working"**
**Solution**: Check browser console for errors, try different browser

---

## 📊 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Chat Mode | ✅ | ✅ | ✅ | ✅ |
| Voice Recognition | ✅ | ⚠️ Limited | ✅ | ✅ |
| Speech Synthesis | ✅ | ✅ | ✅ | ✅ |
| Overall Experience | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Recommended**: Chrome or Edge for best experience

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit**: `git commit -m 'Add amazing feature'`
6. **Push**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Use TypeScript for backend code
- Follow existing code style
- Add comments for complex logic
- Update README if adding features
- Test with multiple roles and scenarios

---

## 📝 License

MIT License - Free to use for learning and development

---

## 🎓 Learning Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [LangChain Documentation](https://js.langchain.com/docs)
- [Web Speech API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🌟 Star This Project!

If this helped you prepare for interviews, please ⭐ star the repository!

---

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Check [ARCHITECTURE_EXPLAINED.md](ARCHITECTURE_EXPLAINED.md) for detailed architecture
- Review troubleshooting section above

---

## 🔮 Future Enhancements

- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] User authentication and history
- [ ] Custom question banks
- [ ] Video interview mode
- [ ] Resume analysis integration
- [ ] Company-specific interview prep
- [ ] Mock coding challenges
- [ ] Interview scheduling
- [ ] Performance analytics dashboard
- [ ] Mobile app (React Native)

---

**Built with ❤️ for job seekers everywhere. Practice makes perfect!**

**100% FREE • No Credit Card • No Hidden Costs** ✨

---

## 💰 Cost Analysis

### Development & Testing
**Total Cost: $0.00** ✨

### Gemini API Free Tier
- **Requests per minute**: 60
- **Requests per day**: Unlimited
- **Cost**: FREE forever

### Voice Processing
- **Speech Recognition**: FREE (browser)
- **Text-to-Speech**: FREE (browser)

### Typical Interview Usage
- **Chat Interview**: ~15-20 API calls = **$0.00**
- **Voice Interview**: ~15-20 API calls + browser processing = **$0.00**
- **Feedback Generation**: 1-2 API calls = **$0.00**

**You can run thousands of interviews completely FREE!**

---

## 🏆 Project Highlights

- ✅ **Production-Ready**: Multi-agent architecture with error handling
- ✅ **Type-Safe**: Full TypeScript backend with strict mode
- ✅ **Modern Stack**: Next.js 14, LangChain, Gemini 2.5 Flash
- ✅ **Beautiful UI**: Tailwind CSS with glassmorphism and animations
- ✅ **Real-Time Analytics**: Continuous candidate evaluation
- ✅ **Adaptive AI**: Adjusts to candidate performance
- ✅ **100% Free**: No API costs, no hidden fees

---

**Version 2.0** - Multi-Agent Architecture with LangChain
