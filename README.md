# AI Interview Practice Partner

> **An intelligent, multi-agent AI interview platform powered by Google Gemini and LangChain**

[![Tech Stack](https://img.shields.io/badge/Stack-TypeScript%20%7C%20Next.js%20%7C%20Gemini%20%7C%20LangChain-blue)](https://github.com)

---

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [API Documentation](#-api-documentation)
- [Multi-Agent System](#-multi-agent-system)
- [Design Decisions](#-design-decisions)

---

## Overview

**Interview Practice Partner** is a sophisticated AI-powered mock interview platform that simulates realistic job interviews using a **multi-agent architecture**. The system intelligently adapts to candidates, provides real-time analytics, and delivers comprehensive feedback to help job seekers improve their interview skills.

### Key Capabilities

**Multi-Agent Intelligence** - Orchestrator, Analyzer, Interviewer, and Feedback agents work together  
**Adaptive Questioning** - AI adjusts difficulty and style based on candidate performance  
**Real-Time Analytics** - Continuous evaluation of communication, technical skills, and engagement  
**Role-Specific Interviews** - Tailored questions for Software Engineers, Product Managers, Sales, and more  
**Voice & Chat Modes** - Flexible interaction options for different practice scenarios  
**Comprehensive Feedback** - Detailed post-interview analysis with actionable insights  

---

## Features

### 1. **Multi-Agent Architecture**

The system uses **four specialized AI agents** that collaborate to create a realistic interview experience:

- **Orchestrator Agent**: Decides interview flow and next steps
- **Analyzer Agent**: Evaluates responses in real-time
- **Interviewer Agent**: Generates contextual questions
- **Feedback Agent**: Provides comprehensive post-interview evaluation

### 2. **Intelligent Adaptation** 

The AI automatically detects and adapts to:
- **Response Length**: Adjusts question style for chatty or brief candidates
- **Technical Depth**: Increases/decreases difficulty based on performance
- **Off-Topic Responses**: Gently steers conversation back on track
- **Confidence Levels**: Provides hints or challenges as appropriate

### 3. **Real-Time Analytics** 
 
Continuous evaluation across multiple dimensions:
- **Communication Score** (1-10)
- **Technical Knowledge** (1-10)
- **Behavioral Skills** (1-10)
- **Confidence Level** (1-10)
- **Engagement Score** (1-10)

### 4. **Voice & Chat Modes**

- **Voice Mode**: Practice speaking skills with real-time speech recognition
- **Chat Mode**: Craft thoughtful written responses
- Seamless switching between modes

### 5. **Comprehensive Feedback** 

Post-interview analysis includes:
- Overall performance score
- Category-wise breakdown
- Specific strengths with examples
- Areas for improvement with actionable advice
- Interview highlights
- Hiring recommendation (Strong Hire / Hire / Maybe / No Hire)

### 6. **Role-Specific Interviews** 

Specialized question sets for:
- Software Engineer
- Product Manager
- Data Scientist
- Sales Representative
- Marketing Manager
- Customer Success Manager

---

## Architecture

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

## Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **AI Model**: Google Gemini 2.5 Flash
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

## Project Structure

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

## Setup Instructions

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

**Important**: Edit `.env` and replace `your_gemini_api_key_here` with your actual Gemini API key.

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

**You're ready to practice!**

---

## API Documentation

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

## Multi-Agent System

### Agent Responsibilities

#### 1. **Orchestrator Agent**
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

#### 2. **Analyzer Agent**
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

#### 3. **Interviewer Agent**
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

#### 4. **Feedback Agent**
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

## Design Decisions

### **Why Multi-Agent Architecture?**

**Decision**: Use specialized agents instead of a monolithic AI

**Reasoning**:
- **Separation of Concerns**: Each agent has a clear, focused responsibility
- **Better Performance**: Specialized prompts yield better results than one-size-fits-all
- **Easier Debugging**: Can test and improve each agent independently
- **Scalability**: Easy to add new agents (e.g., domain expert agent)
- **Flexibility**: Can swap out individual agents without affecting others

**Trade-offs**:
- More API calls (but Gemini is free!)
- Slightly higher latency (mitigated by fast Gemini 2.5 Flash)

### **Why LangChain?**

**Decision**: Use LangChain for agent orchestration

**Reasoning**:
- **Agent Framework**: Built-in support for multi-agent systems
- **Prompt Templates**: Easy to manage and version prompts
- **Output Parsing**: Structured JSON responses with validation
- **Provider Agnostic**: Easy to switch between Gemini, OpenAI, etc.
- **Community**: Large ecosystem and active development

### **Why In-Memory Session Storage?**

**Decision**: Store sessions in-memory (Map)

**Reasoning**:
- **Simple for MVP**: No database setup required
- **Fast Access**: Instant read/write
- **Easy to Migrate**: Can switch to Redis/MongoDB later

---



