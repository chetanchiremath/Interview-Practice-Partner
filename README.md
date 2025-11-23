# 🎯 Interview Practice Partner

An AI-powered mock interview platform that helps job seekers prepare for interviews with realistic practice sessions and detailed feedback.

![Tech Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Next.js%20%7C%20Gemini-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Cost](https://img.shields.io/badge/Cost-100%25%20FREE-brightgreen)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Design Decisions](#design-decisions)
- [User Personas & Testing](#user-personas--testing)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

Interview Practice Partner is a sophisticated conversational AI application that conducts realistic mock interviews for various job roles. The system adapts to different user personas, asks intelligent follow-up questions, and provides comprehensive post-interview feedback.

### 🆓 100% FREE - No API Costs!

This project uses:
- ✅ **Google Gemini API** - FREE with generous limits (60 requests/minute)
- ✅ **Browser Web Speech API** - Built-in, completely FREE
- ✅ **Browser Speech Synthesis** - Built-in, completely FREE

**No credit card required! No hidden costs!**

### Key Capabilities

✅ **Role-Specific Interviews** - Tailored questions for Software Engineers, Sales Reps, Product Managers, and more  
✅ **Adaptive Conversation** - AI detects user personas (confused, efficient, chatty) and adjusts accordingly  
✅ **Multi-Modal Interaction** - Both voice and chat interfaces for flexible practice  
✅ **Intelligent Follow-ups** - Context-aware follow-up questions like a real interviewer  
✅ **Detailed Feedback** - Comprehensive evaluation with scores, strengths, and improvement areas  

---

## ✨ Features

### 1. **Realistic Mock Interviews**
- 6 different job roles with role-specific questions
- Natural conversation flow with opening, main questions, and closing
- 5-8 questions per interview session
- Professional yet supportive interviewer persona

### 2. **Voice & Chat Modes**
- **Voice Mode**: Real-time speech recognition using browser's Web Speech API (FREE!)
- **Chat Mode**: Text-based interaction for careful response crafting
- Seamless switching between modes

### 3. **Adaptive AI Behavior**
The AI automatically detects and adapts to different user types:

- **Confused User**: Offers guidance, suggests roles, asks clarifying questions
- **Efficient User**: Moves quickly, stays focused, provides concise feedback
- **Chatty User**: Gently redirects, maintains interview structure
- **Off-Topic User**: Acknowledges but guides back to relevant topics

### 4. **Comprehensive Feedback**
Post-interview analysis includes:
- Overall score (1-10)
- Breakdown by category (communication, technical knowledge, problem-solving, confidence, relevance)
- Specific strengths with examples
- Areas for improvement with actionable advice
- Interview highlights
- Hiring recommendation (Strong Hire / Hire / Maybe / No Hire)

---

## 🏗️ Architecture

### System Design

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend       │         │  Google Gemini  │
│   (Next.js)     │◄───────►│   (Express)      │◄───────►│   API (FREE!)   │
│                 │         │                  │         │                 │
│  - Role Select  │  HTTP   │  - AI Service    │  API    │  - Gemini Pro   │
│  - Chat UI      │  REST   │  - Voice Service │  Calls  │  - Conversation │
│  - Voice UI     │         │  - Evaluation    │         │  - Analysis     │
│  - Feedback     │         │  - Controllers   │         │                 │
│                 │         │                  │         │                 │
│  Web Speech API │         │                  │         │                 │
│  (FREE Voice)   │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Google Gemini API** - Conversational AI (FREE!)
- **Multer** - File upload handling
- **Axios** - HTTP client

### Frontend
- **Next.js 14** - React framework with App Router
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Web Speech API** - Browser voice recognition (FREE!)
- **Speech Synthesis API** - Browser text-to-speech (FREE!)

### AI Services
- **Gemini Pro** - Main conversational engine (FREE!)
- **Web Speech API** - Speech-to-text (FREE, built into browser!)
- **Speech Synthesis** - Text-to-speech (FREE, built into browser!)

---

## 📁 Project Structure

```
interview-practice-partner/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── gemini.js                # Gemini API configuration
│   │   ├── controllers/
│   │   │   ├── interviewController.js   # Interview API handlers
│   │   │   ├── feedbackController.js    # Feedback API handlers
│   │   │   └── voiceController.js       # Voice status
│   │   ├── services/
│   │   │   ├── aiService.js             # Core AI logic (Gemini)
│   │   │   ├── voiceService.js          # Voice helpers
│   │   │   └── evaluationService.js     # Feedback generation
│   │   ├── routes/
│   │   │   ├── interview.js             # Interview endpoints
│   │   │   ├── feedback.js              # Feedback endpoints
│   │   │   └── voice.js                 # Voice endpoints
│   │   ├── prompts/
│   │   │   ├── systemPrompts.js         # AI system instructions
│   │   │   └── rolePrompts.js           # Role-specific contexts
│   │   ├── middleware/
│   │   │   ├── errorHandler.js          # Error handling
│   │   │   └── validation.js            # Input validation
│   │   └── utils/
│   │       ├── questionBank.js          # Question management
│   │       └── helpers.js               # Utility functions
│   ├── server.js                         # Express server
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── page.js                       # Landing page
│   │   ├── layout.js                     # Root layout
│   │   ├── globals.css                   # Global styles
│   │   ├── interview/page.js             # Interview page
│   │   └── feedback/page.js              # Feedback page
│   ├── components/
│   │   ├── RoleSelector.jsx             # Job role selection
│   │   ├── VoiceInterface.jsx           # Voice mode UI (Web Speech API)
│   │   ├── ChatInterface.jsx            # Chat mode UI
│   │   └── FeedbackDashboard.jsx        # Feedback display
│   ├── lib/
│   │   └── api.js                        # API client
│   └── package.json
│
├── README.md
├── QUICKSTART.md
└── .gitignore
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google Gemini API Key** - [Get FREE key here](https://makersuite.google.com/app/apikey)

### Step 1: Get Your FREE Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (starts with `AIza...`)

**No credit card required! Completely FREE!**

### Step 2: Clone & Install Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
echo "PORT=9000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000" > .env
```

**Edit `.env` and paste your Gemini API key**

### Step 3: Start Backend

```bash
# Development mode (auto-restart on changes)
npm run dev
```

Backend runs on `http://localhost:9000`

### Step 4: Install & Start Frontend

**Open a NEW terminal:**

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:9000" > .env.local

# Start frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

### Step 5: Open Browser

```
http://localhost:3000
```

**That's it! You're ready to practice! 🎉**

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
  "interactionMode": "chat"
}
```

#### **2. Send Response**
```http
POST /interview/respond
Content-Type: application/json

{
  "sessionId": "session_xxx",
  "message": "I have 5 years of experience..."
}
```

#### **3. Generate Feedback**
```http
POST /feedback/generate
Content-Type: application/json

{
  "sessionId": "session_xxx",
  "quick": false
}
```

#### **4. Get Available Roles**
```http
GET /feedback/roles
```

---

## 🎨 Design Decisions

### 1. **Why Google Gemini Instead of OpenAI?**

**Decision**: Use Google Gemini API

**Reasoning**:
- ✅ **100% FREE** - No credit card required
- ✅ **Generous Limits** - 60 requests/minute
- ✅ **High Quality** - Comparable to GPT-4
- ✅ **Easy to Use** - Simple API
- ✅ **No Billing** - Perfect for learning and demos

**OpenAI Alternative**: Would cost $0.15-$0.60 per interview

### 2. **Why Browser-Based Voice?**

**Decision**: Use Web Speech API and Speech Synthesis API

**Reasoning**:
- ✅ **100% FREE** - No API costs
- ✅ **No Server Processing** - Reduces backend load
- ✅ **Built-in** - Available in all modern browsers
- ✅ **Low Latency** - Processes locally
- ✅ **Privacy** - Audio doesn't leave user's device

**Drawbacks**: Requires Chrome, Edge, or Safari

### 3. **Why Full JavaScript Stack?**

**Decision**: Node.js + Express + Next.js

**Reasoning**:
- Single language across stack
- Easy code sharing
- Fast development
- Great ecosystem

### 4. **Session Management**

**Decision**: In-memory storage

**Reasoning**:
- Simple for MVP
- Fast access
- Easy to migrate to Redis later

---

## 👥 User Personas & Testing

### 1. **The Confused User** 😕
**System Response**: Offers guidance, suggestions, and examples

### 2. **The Efficient User** ⚡
**System Response**: Quick, focused questions without fluff

### 3. **The Chatty User** 💬
**System Response**: Gentle redirection to stay on topic

### 4. **The Edge Case User** 🚨
**System Response**: Graceful error handling and clear messages

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
- **Chat Interview**: ~10-15 API calls = **$0.00**
- **Voice Interview**: ~10-15 API calls + browser processing = **$0.00**
- **Feedback Generation**: 1-2 API calls = **$0.00**

**You can run thousands of interviews completely FREE!**

---

## 🎯 Getting Started Tips

### 1. **Test Chat Mode First**
- Easier to debug
- See exactly what AI says
- Good for understanding flow

### 2. **Try Voice Mode in Chrome**
- Best browser support
- Most accurate recognition
- Natural-sounding voices

### 3. **Test All Personas**
- Confused: "I'm not sure what to say"
- Efficient: Give 20-word answers
- Chatty: Give 200+ word answers
- Edge: Try invalid inputs

### 4. **Check Feedback Quality**
- Complete at least 3 interviews
- Compare feedback across roles
- Note specific examples given

---

## 🚀 Deployment Options

### Vercel (Recommended for Frontend)
```bash
cd frontend
vercel deploy
```

### Railway/Render (For Backend)
```bash
# Add these environment variables:
PORT=9000
GEMINI_API_KEY=your_key
```

### Docker (Optional)
```bash
docker-compose up
```

---

## 🐛 Troubleshooting

### "Speech recognition not supported"
**Solution**: Use Chrome, Edge, or Safari

### "Failed to generate response"
**Solution**: Check your Gemini API key in `.env`

### "Port already in use"
**Solution**: Change port in `.env` or kill process

### Voice not working
**Solution**: Allow microphone permissions in browser

---

## 📊 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Chat Mode | ✅ | ✅ | ✅ | ✅ |
| Voice Recognition | ✅ | ⚠️ Limited | ✅ | ✅ |
| Speech Synthesis | ✅ | ✅ | ✅ | ✅ |

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

MIT License - Free to use for learning and development

---

## 🎓 Learning Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Web Speech API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 🌟 Star This Project!

If this helped you prepare for interviews, please ⭐ star the repository!

---

## 📞 Support

For questions or issues:
- Create an issue in the repository
- Check existing documentation
- Review troubleshooting section

---

**Built with ❤️ for job seekers everywhere. Practice makes perfect!**

**100% FREE • No Credit Card • No Hidden Costs** ✨
