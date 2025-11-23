// Voice Interface Component - Voice-based interview interaction
// Uses browser's FREE Web Speech API for speech recognition and synthesis
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

export default function VoiceInterface({ sessionId, onEnd }) {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [error, setError] = useState('');
  const [browserSupport, setBrowserSupport] = useState({ speech: false, synthesis: false });
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(null);
  
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    checkBrowserSupport();
    loadVoices();
    fetchInitialMessage();
  }, []);
  
  // Load and auto-select best voice
  function loadVoices() {
    if ('speechSynthesis' in window) {
      console.log('🔊 Loading voices...');
      
      const loadVoicesList = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const englishVoices = voices.filter(v => v.lang.startsWith('en'));
          setAvailableVoices(englishVoices);
          
          // Auto-select best voice
          const bestVoiceIndex = findBestVoiceIndex(englishVoices);
          setSelectedVoiceIndex(bestVoiceIndex);
          console.log('✅ Auto-selected BEST voice:', englishVoices[bestVoiceIndex]?.name);
        }
      };
      
      // Try immediate load
      loadVoicesList();
      
      // Also listen for voices changed event (Chrome needs this)
      window.speechSynthesis.onvoiceschanged = loadVoicesList;
    }
  }
  
  // Find the index of the best available voice
  function findBestVoiceIndex(voices) {
    // Priority order (higher score = better)
    const priorities = [
      { pattern: /Google.*en-US.*Female/, score: 100 },
      { pattern: /Google.*en-US/, score: 90 },
      { pattern: /Google.*en/, score: 80 },
      { pattern: /Samantha/, score: 70 },
      { pattern: /Karen/, score: 65 },
      { pattern: /Microsoft Zira/, score: 60 },
      { pattern: /Enhanced/, score: 50 },
      { pattern: /Natural/, score: 45 },
      { pattern: /Female|Woman/, score: 40 },
    ];
    
    let bestIndex = 0;
    let bestScore = 0;
    
    voices.forEach((voice, index) => {
      for (const { pattern, score } of priorities) {
        if (pattern.test(voice.name)) {
          if (score > bestScore) {
            bestScore = score;
            bestIndex = index;
          }
          break; // Stop at first match for this voice
        }
      }
    });
    
    return bestIndex;
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function checkBrowserSupport() {
    // Check for Speech Recognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasSpeech = !!SpeechRecognition;
    
    // Check for Speech Synthesis API - Chrome has this!
    const hasSynthesis = 'speechSynthesis' in window && typeof window.speechSynthesis !== 'undefined';
    
    console.log('🔍 Browser Support Check:', {
      hasSpeech,
      hasSynthesis,
      userAgent: navigator.userAgent,
    });
    
    setBrowserSupport({ speech: hasSpeech, synthesis: hasSynthesis });

    if (!hasSpeech) {
      setError('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    
    // Force load voices for Chrome
    if (hasSynthesis && window.speechSynthesis) {
      // Chrome needs this to load voices
      window.speechSynthesis.getVoices();
      
      // Also set up the event listener for when voices load
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          const voices = window.speechSynthesis.getVoices();
          console.log('✅ Voices loaded:', voices.length, 'voices available');
          // Update support to true once voices are loaded
          setBrowserSupport({ speech: hasSpeech, synthesis: true });
        };
      }
    }

    // Initialize Speech Recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;  // ✅ Keep listening until manually stopped!
    recognition.interimResults = true;  // ✅ Show what you're saying in real-time
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    let finalTranscript = '';  // Store complete answer
    let interimTranscript = '';  // Store what's being said now

    recognition.onresult = (event) => {
      interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Show user what they're saying in real-time
      console.log('Speaking:', interimTranscript || finalTranscript);
    };

    recognition.onerror = (event) => {
      // Ignore benign "errors" that are actually normal browser behavior
      const benignErrors = ['no-speech', 'aborted', 'audio-capture'];
      
      if (benignErrors.includes(event.error)) {
        // Not a real error - just normal browser behavior
        console.log('ℹ️ Speech recognition:', event.error, '(this is normal, not an error)');
        return; // Don't set error or stop listening
      }
      
      // ACTUAL errors - network issues, permission denied, etc.
      console.error('❌ Speech recognition error:', event.error);
      setError(`Microphone error: ${event.error}. Please check permissions and try again.`);
      setIsListening(false);
      finalTranscript = '';
    };

    recognition.onend = () => {
      // If we have a transcript, process it
      if (finalTranscript.trim()) {
        console.log('✅ Processing answer:', finalTranscript.trim().substring(0, 50) + '...');
        handleSpeechResult(finalTranscript.trim());
        finalTranscript = '';
      } else {
        console.log('ℹ️ Microphone stopped with no speech detected');
      }
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }

  async function fetchInitialMessage() {
    try {
      const response = await api.get(`/interview/session/${sessionId}`);
      
      const initialContent = `Hello! I'm your interviewer today. Let's begin the interview for the ${response.data.data.role.replace(/_/g, ' ')} position. First, tell me a bit about yourself and what interests you about this role.`;
      
      setMessages([
        {
          role: 'assistant',
          content: initialContent,
          timestamp: new Date(),
        },
      ]);
      
      // DON'T auto-speak initial message (browser blocks it)
      // Voice will start after user clicks the microphone button
      console.log('✅ Initial message ready. Click the microphone to start voice interaction.');
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch initial message:', err);
      setLoading(false);
    }
  }

  function speakText(text) {
    // Force check - Chrome sometimes reports false initially
    const actuallyHasSynthesis = 'speechSynthesis' in window && typeof window.speechSynthesis !== 'undefined';
    
    if (!actuallyHasSynthesis) {
      console.warn('Speech synthesis not supported');
      // Update UI to show text instead
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Wait for voices to load (they load asynchronously)
    let voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // Voices not loaded yet, wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        speakWithVoice(text, voices);
      };
      return;
    }
    
    speakWithVoice(text, voices);
  }

  function speakWithVoice(text, voices) {
    // 🎯 Preprocess text for MORE NATURAL speech
    const naturalText = makeTextNatural(text);
    
    const utterance = new SpeechSynthesisUtterance(naturalText);
    
    // 🎤 Use selected voice or auto-find best voice
    let preferredVoice;
    
    if (selectedVoiceIndex !== null && availableVoices[selectedVoiceIndex]) {
      // User has selected a voice - use it!
      preferredVoice = availableVoices[selectedVoiceIndex];
    } else {
      // Auto-select BEST premium voice
      preferredVoice = 
        // 🥇 First priority: Google enhanced voices (BEST quality in Chrome)
        voices.find(v => v.name.includes('Google') && v.lang.startsWith('en-US') && v.name.includes('Female')) ||
        voices.find(v => v.name.includes('Google') && v.lang.startsWith('en-US')) ||
        voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
        
        // 🥈 Second priority: Premium system voices (macOS/Windows best)
        voices.find(v => v.name.includes('Samantha')) ||        // macOS premium female
        voices.find(v => v.name.includes('Karen')) ||           // macOS alternative
        voices.find(v => v.name.includes('Microsoft Zira')) ||  // Windows premium
        voices.find(v => v.name.includes('Microsoft David')) || // Windows male
        
        // 🥉 Third priority: Enhanced/Natural voices
        voices.find(v => v.lang.startsWith('en') && v.name.includes('Enhanced')) ||
        voices.find(v => v.lang.startsWith('en') && v.name.includes('Natural')) ||
        
        // Any female voice
        voices.find(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Woman'))) ||
        
        // Fallback: Any English voice
        voices.find(v => v.lang.startsWith('en')) ||
        voices[0];
    }
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log('🎤 Using voice:', preferredVoice.name, '|', preferredVoice.localService ? '📍 Local (fast!)' : '☁️ Network');
    }

    // 🎯 OPTIMIZED parameters for HUMAN-LIKE delivery
    utterance.rate = 0.95;   // Slightly slower = more professional, clear, warm
    utterance.pitch = 1.08;  // Higher pitch = friendly, approachable (Sarah Chen personality)
    utterance.volume = 0.9;  // Slightly lower = less robotic, more natural

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  // 🎭 Make text sound MUCH more natural with strategic pauses and pacing
  function makeTextNatural(text) {
    return text
      // Add natural breathing pauses after punctuation
      .replace(/\./g, '.  ')       // Longer pause after sentences
      .replace(/\?/g, '?  ')       // Pause after questions (natural thinking)
      .replace(/!/g, '!  ')        // Pause after excitement
      .replace(/,/g, ', ')         // Brief natural pause after commas
      .replace(/:/g, ':  ')        // Pause before elaboration
      .replace(/;/g, ';  ')        // Pause between related thoughts
      
      // Add breathing room between sentences (sounds less rushed)
      .replace(/([.!?])\s+([A-Z])/g, '$1   $2')
      
      // Emphasize positive words slightly (browser TTS picks up on this)
      .replace(/\b(great|excellent|fantastic|perfect|wonderful|impressive)\b/gi, match => match.toUpperCase())
      
      // Clean up excessive spaces
      .replace(/\s{4,}/g, '   ')
      .trim();
  }

  function startListening() {
    if (!recognitionRef.current) {
      setError('Speech recognition not initialized. Please refresh the page.');
      return;
    }

    if (isListening) {
      // User clicked to STOP recording
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    // User clicked to START recording
    try {
      // 🎤 On FIRST click: Just speak the greeting, don't start recording yet
      if (isFirstInteraction && messages.length > 0) {
        console.log('🎤 First click - AI will speak greeting. Click mic again to answer!');
        speakText(messages[0].content);
        setIsFirstInteraction(false);
        return; // Don't start recording yet - let them hear the greeting first!
      }
      
      // 🎤 On subsequent clicks: Start recording their answer
      recognitionRef.current.start();
      setIsListening(true);
      setError('');
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setError('Failed to start listening. Please try again.');
    }
  }

  async function handleSpeechResult(transcript) {
    setIsListening(false);
    setIsProcessing(true);

    // Add user message
    const userMessage = {
      role: 'user',
      content: transcript,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send to interview API
      const response = await api.post('/interview/respond', {
        sessionId,
        message: transcript,
      });

      // Add AI response
      const aiMessage = {
        role: 'assistant',
        content: response.data.data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Speak AI response
      speakText(response.data.data.message);

      // Check if interview should end
      if (response.data.data.shouldEnd) {
        setInterviewEnded(true);
        setTimeout(() => {
          handleNavigateToFeedback();
        }, 5000);
      }
    } catch (err) {
      console.error('Failed to process response:', err);
      setError('Failed to process your response. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleNavigateToFeedback() {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    await api.post('/interview/end', { sessionId });
    router.push(`/feedback?session=${sessionId}`);
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing voice interview...</p>
        </div>
      </div>
    );
  }

  if (!browserSupport.speech) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="card max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Browser Not Supported</h2>
          <p className="text-gray-700 mb-6">
            Your browser doesn't support voice recognition. Please use Chrome, Edge, or Safari for voice mode.
          </p>
          <button onClick={() => router.push('/')} className="btn-primary">
            Try Chat Mode Instead
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col card">
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Browser info - Simple */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4 text-sm">
        ✨ Using FREE browser-based voice - AI will SPEAK to you! 🔊
        {!browserSupport.synthesis && (
          <div className="text-red-600 font-bold mt-2">
            ⚠️ Audio not supported in this browser - use Chrome!
          </div>
        )}
      </div>
      
      {/* Speaking Indicator - BIG AND OBVIOUS */}
      {isSpeaking && (
        <div className="bg-green-100 border-2 border-green-500 text-green-800 px-6 py-4 rounded-lg mb-4 text-center animate-pulse">
          <div className="text-2xl mb-2">🔊 🎤 🔊</div>
          <p className="font-bold text-lg">AI IS SPEAKING NOW!</p>
          <p className="text-sm">Listen to Sarah's response...</p>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.role === 'assistant' && (
                <p className="text-xs font-semibold mb-1 opacity-75 flex items-center gap-1">
                  🎤 Interviewer
                </p>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {interviewEnded && (
          <div className="flex justify-center fade-in">
            <div className="bg-green-100 border-2 border-green-400 rounded-lg px-6 py-4 text-center">
              <p className="text-green-800 font-semibold mb-2">
                ✅ Interview Completed!
              </p>
              <p className="text-green-700 text-sm">
                Generating your feedback...
              </p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Controls */}
      {!interviewEnded && (
        <div className="border-t border-gray-200 p-6">
          <div className="flex flex-col items-center">
            {/* Status Text */}
            <div className="mb-4 text-center">
              {isProcessing ? (
                <p className="text-gray-600">Processing your response...</p>
              ) : isSpeaking ? (
                <p className="text-gray-600 flex items-center gap-2 justify-center">
                  <span className="animate-pulse">🔊</span> Interviewer is speaking...
                </p>
              ) : isListening ? (
                <div className="text-center">
                  <p className="text-red-600 font-bold text-lg flex items-center gap-2 justify-center mb-2">
                    <span className="animate-pulse">🔴</span> LISTENING - Speak now!
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    Click microphone again when done to submit
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    (Microphone is waiting for your voice - just start talking!)
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">
                  {isFirstInteraction ? (
                    <span className="font-semibold text-green-600 text-lg">
                      👋 Click the microphone below to hear the AI interviewer speak!
                    </span>
                  ) : (
                    'Click the microphone to start recording your answer'
                  )}
                </p>
              )}
            </div>

            {/* Microphone Button */}
            <button
              onClick={startListening}
              disabled={isProcessing || isSpeaking || interviewEnded}
              className={`mic-button flex items-center justify-center ${
                isListening ? 'recording bg-red-500' : 'bg-primary-600 hover:bg-primary-700'
              } text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>

            {/* Helper Text */}
            <p className="text-xs text-gray-500 mt-4 text-center max-w-md">
              💡 Tip: Click once to START recording, speak your full answer, then click again to STOP and submit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
