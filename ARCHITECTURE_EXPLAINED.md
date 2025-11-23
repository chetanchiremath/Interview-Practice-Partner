# 🏗️ Architecture Explained - What's Happening Where

A comprehensive guide to understanding how the Interview Practice Partner works.

---

## 🎯 High-Level Overview

The system is divided into two main parts:

1. **Backend (Express Server)** - Handles all AI logic, API calls, and business logic
2. **Frontend (Next.js App)** - Handles UI, user interaction, and display

They communicate via REST APIs and work together to create a seamless interview experience.

---

## 📂 Backend Architecture Deep Dive

### **Entry Point: `server.js`**

**What happens here:**
- Express server is initialized
- Middleware is configured (CORS, body parsing, rate limiting)
- All routes are registered (`/api/interview`, `/api/feedback`, `/api/voice`)
- Error handlers are set up
- Server starts listening on port 5000

**Flow:**
```
User Request → Express Server → Route → Controller → Service → OpenAI API
                     ↓
              Response back to user
```

---

### **Configuration: `src/config/openai.js`**

**What happens here:**
- OpenAI client is initialized with API key from environment variables
- This client is imported and used throughout the backend for AI operations

**Why separate file:**
- Single source of truth for OpenAI configuration
- Easy to modify settings in one place
- Can add retry logic, timeout settings, etc.

---

### **Controllers** (Handle HTTP Requests)

#### `interviewController.js`
**Responsibilities:**
- Start new interview sessions
- Process user responses
- Get session information
- End interviews

**Example Flow - Start Interview:**
```
1. User clicks "Start Interview" on frontend
2. POST /api/interview/start received
3. Validate role selection
4. Generate unique session ID
5. Call aiService.initializeInterview()
6. Return session data + first question to frontend
```

#### `feedbackController.js`
**Responsibilities:**
- Generate comprehensive feedback
- Provide quick feedback summaries
- Return available role information

**Example Flow - Generate Feedback:**
```
1. Interview ends
2. POST /api/feedback/generate received
3. Get session data from aiService
4. Call evaluationService.generateFeedback()
5. AI analyzes all responses
6. Returns structured feedback with scores
7. Session is cleaned up from memory
```

#### `voiceController.js`
**Responsibilities:**
- Transcribe audio to text (Speech-to-Text)
- Convert text to audio (Text-to-Speech)
- Validate audio formats

**Example Flow - Voice Response:**
```
1. User speaks into microphone
2. Frontend records audio as WebM
3. POST /api/voice/transcribe with audio file
4. voiceService.speechToText() calls OpenAI Whisper
5. Returns transcribed text
6. Frontend sends text to /api/interview/respond
7. AI generates response text
8. POST /api/voice/synthesize with response
9. Returns audio file
10. Frontend plays audio
```

---

### **Services** (Business Logic)

#### `aiService.js` - The Brain 🧠
**This is the most important file!**

**What it does:**
1. **Session Management**
   - Creates and stores interview sessions in memory
   - Tracks conversation history
   - Manages interview phases (opening → main → closing → ended)

2. **Conversation Management**
   ```javascript
   conversationHistory = [
     { role: 'system', content: 'You are an interviewer...' },
     { role: 'assistant', content: 'Tell me about yourself' },
     { role: 'user', content: 'I am a software engineer...' },
     { role: 'assistant', content: 'What technologies...' },
     // ... continues
   ]
   ```

3. **Persona Detection**
   - Analyzes user responses
   - Detects if user is confused, efficient, or chatty
   - Adapts AI behavior accordingly

4. **AI Communication**
   - Builds prompts with context
   - Calls OpenAI GPT-4
   - Processes responses

**Key Function: `processResponse()`**
```javascript
async function processResponse(sessionId, userMessage) {
  // 1. Add user message to history
  // 2. Detect user persona (confused/efficient/chatty)
  // 3. Build AI prompt with additional instructions
  // 4. Call OpenAI GPT-4
  // 5. Get AI response
  // 6. Update interview phase
  // 7. Check if should end
  // 8. Return response to user
}
```

**Why it's important:**
- This is where the "intelligence" lives
- Controls conversation flow
- Makes the interview feel natural

#### `voiceService.js` - Voice Processing 🎤
**What it does:**
1. **Speech-to-Text (Whisper)**
   ```javascript
   Audio file → Save to temp → Send to Whisper API → Get text → Clean up
   ```

2. **Text-to-Speech (TTS)**
   ```javascript
   Text → Send to OpenAI TTS → Get MP3 audio → Return to frontend
   ```

**Why separate service:**
- Voice processing is complex
- Keeps controllers clean
- Easy to switch to different voice providers (e.g., ElevenLabs)

#### `evaluationService.js` - Feedback Generation 📊
**What it does:**
1. Collects all user responses from interview
2. Builds evaluation prompt for GPT-4
3. Asks AI to analyze performance across multiple dimensions
4. Parses structured JSON feedback
5. Adds metadata (duration, scores, recommendations)

**Evaluation Criteria:**
- Communication (clarity, structure)
- Technical Knowledge (depth, accuracy)
- Problem Solving (approach, creativity)
- Confidence (assertiveness, composure)
- Relevance (staying on topic)

**Output Structure:**
```javascript
{
  overallScore: 8,
  scores: { communication: 9, technicalKnowledge: 7, ... },
  strengths: ["Specific example 1", "Specific example 2"],
  improvements: ["Area 1 with advice", "Area 2 with advice"],
  highlights: ["Best moment from interview"],
  recommendation: "HIRE"
}
```

---

### **Prompts** (AI Instructions)

#### `systemPrompts.js` - AI Personality
**What's here:**
- Base system prompt defining interviewer behavior
- Persona-specific adaptations
- Instructions for different user types

**Why it matters:**
- This shapes how the AI behaves
- Makes it professional yet supportive
- Defines interview structure

#### `rolePrompts.js` - Job-Specific Context
**What's here:**
- Context for each role (Software Engineer, Sales Rep, etc.)
- Sample questions for each role
- Evaluation criteria per role

**Example - Software Engineer:**
```javascript
{
  context: "You are interviewing for a Software Engineer position...",
  sampleQuestions: [
    "Tell me about a challenging technical problem...",
    "How do you approach debugging...",
    ...
  ],
  evaluationCriteria: [
    "Technical depth and accuracy",
    "Problem-solving approach",
    ...
  ]
}
```

---

### **Routes** (URL Mapping)

Routes are simple - they map URLs to controller functions:

```javascript
// interview.js
POST /api/interview/start → interviewController.startInterview
POST /api/interview/respond → interviewController.sendResponse
GET  /api/interview/session/:id → interviewController.getSession
POST /api/interview/end → interviewController.endInterview
```

---

### **Middleware** (Cross-Cutting Concerns)

#### `errorHandler.js`
- Catches all errors in the application
- Formats error responses consistently
- Handles different error types appropriately

#### `validation.js`
- Validates required fields in requests
- Implements simple rate limiting
- Prevents API abuse

---

### **Utils** (Helper Functions)

#### `questionBank.js`
- Common behavioral questions
- Follow-up question templates
- Helper functions for question management

#### `helpers.js`
- UUID generation for sessions
- Input sanitization
- Role validation
- Response formatting

---

## 🎨 Frontend Architecture Deep Dive

### **App Router Structure** (Next.js 14)

```
app/
├── page.js              → Landing page (/)
├── layout.js            → Wraps all pages
├── globals.css          → Global styles
├── interview/
│   └── page.js          → Interview interface (/interview?session=...)
└── feedback/
    └── page.js          → Feedback display (/feedback?session=...)
```

---

### **Pages Explained**

#### `app/page.js` - Landing Page
**What happens here:**
1. Fetch available roles from API
2. Display role selection cards
3. Let user choose voice or chat mode
4. On "Start Interview" click:
   - Call `/api/interview/start`
   - Get session ID
   - Navigate to `/interview?session=...`

**UI Components:**
- Role selector cards (clickable, highlight on select)
- Mode toggle (voice vs chat)
- Start button

#### `app/interview/page.js` - Interview Interface
**What happens here:**
1. Get session ID from URL params
2. Fetch session data to verify it exists
3. Render appropriate interface (VoiceInterface or ChatInterface)
4. Handle "End Interview" button

**Flow:**
```
URL has session ID → Fetch session → Show interview UI → Handle responses
```

#### `app/feedback/page.js` - Feedback Display
**What happens here:**
1. Get session ID from URL
2. Call `/api/feedback/generate`
3. Show loading animation (AI is analyzing)
4. Display comprehensive feedback dashboard
5. Provide "Practice Again" button

---

### **Components Explained**

#### `RoleSelector.jsx` - Role Selection Cards
**Responsibility:**
- Display all available roles as clickable cards
- Show icons, names, descriptions
- Handle selection state
- Highlight selected role

**Props:**
```javascript
{
  roles: [{ id, name, description }, ...],
  selectedRole: 'SOFTWARE_ENGINEER',
  onSelectRole: (roleId) => { ... }
}
```

#### `ChatInterface.jsx` - Text-Based Interview
**What it does:**
1. Maintains message history locally
2. Displays messages in chat bubble format
3. Handles user input via text field
4. On send:
   - Add user message to chat
   - Call `/api/interview/respond`
   - Add AI response to chat
   - Auto-scroll to bottom
5. Detects when interview should end

**State Management:**
```javascript
[messages, setMessages] = useState([
  { role: 'assistant', content: '...', timestamp: ... },
  { role: 'user', content: '...', timestamp: ... },
  ...
])
```

**Visual Features:**
- User messages: Blue, right-aligned
- AI messages: Gray, left-aligned
- Typing indicator while waiting
- Success message when complete

#### `VoiceInterface.jsx` - Voice-Based Interview
**What it does:**
1. Requests microphone permission
2. On mic button click:
   - Start recording with MediaRecorder API
   - Show recording indicator (red pulsing)
3. On stop:
   - Convert audio chunks to Blob
   - Send to `/api/voice/transcribe`
   - Display transcription as user message
   - Send transcription to `/api/interview/respond`
   - Get AI text response
   - Send to `/api/voice/synthesize`
   - Play audio response
4. Repeat until interview ends

**Technical Stack:**
```
Browser Microphone → MediaRecorder API → WebM Audio
    ↓
Blob → FormData → Backend
    ↓
Whisper API → Text → GPT-4 → Text → TTS API
    ↓
MP3 Audio → Browser Audio Player
```

**Visual Features:**
- Large microphone button (changes color when recording)
- Pulse animation while recording
- Status text ("Recording...", "Processing...", "Speaking...")
- Disabled while AI is speaking

#### `FeedbackDashboard.jsx` - Results Display
**What it does:**
1. Takes feedback object as prop
2. Displays:
   - Overall score with color coding
   - Score breakdown by category (circular badges)
   - Strengths list (green, bullet points)
   - Improvements list (yellow, bullet points)
   - Highlights (purple, special formatting)
   - Red flags if any (red, warnings)
   - Overall feedback narrative
   - Next steps recommendations

**Scoring Visual:**
```javascript
Score >= 8 → Green
Score >= 6 → Yellow
Score < 6  → Red
```

---

### **Lib: `api.js`** - API Client
**What it does:**
- Creates Axios instance with base URL
- Sets default headers
- Adds request/response interceptors for logging
- Handles errors consistently

**Usage in components:**
```javascript
import api from '../lib/api';

const response = await api.post('/interview/start', { role: 'SOFTWARE_ENGINEER' });
```

---

## 🔄 Complete User Journey Flows

### **Flow 1: Chat Interview**

```
1. User visits homepage (/)
   → RoleSelector displays roles fetched from API

2. User clicks "Software Engineer"
   → Role card highlights, selectedRole state updates

3. User clicks "Chat Mode"
   → interactionMode = 'chat'

4. User clicks "Start Interview"
   → POST /api/interview/start { role, interactionMode }
   → Backend: interviewController.startInterview()
   → Backend: aiService.initializeInterview()
   → Backend: Creates session, generates opening question
   → Returns: { sessionId, message: "Tell me about yourself..." }
   → Navigate to /interview?session=abc123&mode=chat

5. Interview page loads
   → ChatInterface component mounts
   → Displays initial question from AI

6. User types response, clicks Send
   → POST /api/interview/respond { sessionId, message }
   → Backend: aiService.processResponse()
   → Backend: Adds to conversation history
   → Backend: Calls GPT-4 with full context
   → Backend: Gets next question
   → Returns: { message: "What technologies...", shouldEnd: false }
   → ChatInterface adds both messages to display

7. Repeat step 6 until 7-8 questions asked
   → AI detects interview should end
   → Returns: { shouldEnd: true }

8. Auto-navigate to /feedback?session=abc123
   → POST /api/feedback/generate { sessionId }
   → Backend: evaluationService.generateFeedback()
   → Backend: AI analyzes all responses
   → Backend: Generates structured feedback
   → Returns: { overallScore: 8, scores: {...}, ... }
   → FeedbackDashboard displays results

9. User reviews feedback, clicks "Practice Again"
   → Navigate back to /
```

### **Flow 2: Voice Interview**

```
1-4. Same as Chat flow, but mode = 'voice'

5. Interview page loads with VoiceInterface
   → Requests microphone permission
   → Plays initial question audio

6. User clicks microphone button
   → MediaRecorder starts recording
   → Red pulse animation shows

7. User speaks, clicks button again to stop
   → MediaRecorder stops
   → Audio chunks combined into Blob
   → POST /api/voice/transcribe with FormData(audio)
   → Backend: voiceService.speechToText()
   → Backend: Calls Whisper API
   → Returns: { text: "I have 5 years of experience..." }
   
8. Transcription sent to interview API
   → POST /api/interview/respond { sessionId, message: transcription }
   → Backend: aiService.processResponse()
   → Backend: GPT-4 generates next question
   → Returns: { message: "Tell me more about your projects" }

9. Text-to-Speech conversion
   → POST /api/voice/synthesize { text }
   → Backend: voiceService.textToSpeech()
   → Backend: Calls OpenAI TTS
   → Returns: MP3 audio buffer
   → Browser plays audio

10. Repeat 6-9 until interview complete
    → Navigate to feedback page
    → Same as chat flow
```

---

## 🧪 Persona Detection in Action

### **Example: Detecting Confused User**

```javascript
// In aiService.js - processResponse()

User message: "I'm not really sure what to say..."

detectUserPersona() checks for keywords:
  - "not sure" ✓
  - Sets session.userPersona = 'confused'

buildAdditionalInstructions() adds:
  CONFUSED_USER prompt to conversation

AI receives enhanced context:
  "The candidate seems uncertain. Be extra helpful:
   - Offer suggestions
   - Provide examples
   - Ask clarifying questions
   - Be patient and encouraging"

AI response: "No problem! Let me help you out. 
              Can you start by telling me about your 
              current or most recent work experience? 
              For example, what did a typical day look like?"
```

---

## 💡 Key Design Patterns Used

### 1. **Controller-Service Pattern**
```
Controller (HTTP) → Service (Business Logic) → External API
```
- Controllers handle HTTP concerns
- Services contain business logic
- Clean separation of concerns

### 2. **Session State Management**
```javascript
const activeSessions = new Map();
// Key: sessionId
// Value: { conversationHistory, phase, persona, ... }
```
- In-memory for speed
- Easy to migrate to Redis

### 3. **Middleware Pipeline**
```
Request → Rate Limit → CORS → Body Parser → Routes → Controller
                                                         ↓
Error ← Error Handler ← Service throws Error ← Service
```

### 4. **Prompt Engineering**
- System prompt (personality) + Role prompt (context) + Instructions (adaptations)
- Dynamic prompt building based on state

---

## 🚀 Performance Optimizations

1. **Parallel Processing**: Frontend makes multiple API calls in parallel where possible
2. **Lazy Loading**: Components load only when needed
3. **Efficient Re-renders**: React state updates optimized
4. **Audio Streaming**: Could stream audio instead of waiting for complete file
5. **Caching**: Could cache role definitions, common questions

---

## 🔐 Security Considerations

1. **Input Sanitization**: All user inputs are sanitized
2. **Rate Limiting**: Prevents API abuse
3. **CORS**: Restricts which frontends can access API
4. **API Key Protection**: Never exposed to frontend
5. **Session Isolation**: Sessions can't access each other's data

---

## 📊 Monitoring & Debugging

**Backend Logging:**
```javascript
console.log(`[${timestamp}] ${method} ${path}`);
```

**Frontend Error Boundaries:**
- Catches React errors
- Shows friendly error messages

**API Error Responses:**
```javascript
{
  success: false,
  error: "Descriptive error message",
  code: 400,
  timestamp: "2024-01-01T12:00:00Z"
}
```

---

## 🎓 Learning Takeaways

### **For Understanding AI Systems:**
- See how conversation context is maintained
- Learn prompt engineering techniques
- Understand state machines for conversation flow

### **For Full-Stack Development:**
- Clean architecture patterns
- API design best practices
- Frontend-backend communication

### **For Production Readiness:**
- Error handling strategies
- User experience considerations
- Performance optimization techniques

---

**This architecture is production-ready with minimal modifications (mainly adding database persistence and authentication).**

