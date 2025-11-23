// Chat Interface Component - Text-based interview interaction
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

export default function ChatInterface({ sessionId, onEnd }) {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch initial message
    fetchInitialMessage();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollToBottom();
  }, [messages]);

  async function fetchInitialMessage() {
    try {
      const response = await api.get(`/interview/session/${sessionId}`);
      
      // Add initial greeting message
      setMessages([
        {
          role: 'assistant',
          content: `Hello! I'm your interviewer today. Let's begin the interview for the ${response.data.data.role.replace(/_/g, ' ')} position. First, tell me a bit about yourself and what interests you about this role.`,
          timestamp: new Date(),
        },
      ]);
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch initial message:', err);
      // Check if session was lost
      if (err.response?.status === 404) {
        alert('Your interview session has expired. Please start a new interview.');
        router.push('/');
        return;
      }
      setLoading(false);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    
    if (!inputMessage.trim() || sending) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    // Add user message to chat
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);

    try {
      // Send to backend
      const response = await api.post('/interview/respond', {
        sessionId,
        message: userMessage,
      });

      // Add AI response to chat
      const aiMessage = {
        role: 'assistant',
        content: response.data.data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Check if interview should end
      if (response.data.data.shouldEnd) {
        setInterviewEnded(true);
        setTimeout(() => {
          handleNavigateToFeedback();
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      
      // Check if session was lost (404 error)
      if (err.response?.status === 404) {
        const sessionLostMessage = {
          role: 'system',
          content: '⚠️ Your interview session has expired (server was restarted). Please start a new interview from the home page.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, sessionLostMessage]);
        setInterviewEnded(true);
        
        setTimeout(() => {
          router.push('/');
        }, 4000);
      } else {
        const errorMessage = {
          role: 'system',
          content: 'Sorry, there was an error processing your response. Please try again.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setSending(false);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleNavigateToFeedback() {
    await api.post('/interview/end', { sessionId });
    router.push(`/feedback?session=${sessionId}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-sm ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white rounded-br-none'
                  : message.role === 'system'
                  ? 'bg-red-50 text-red-800 border border-red-100'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
              }`}
            >
              {message.role === 'assistant' && (
                <p className="text-xs font-semibold mb-1 opacity-75">Interviewer</p>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {sending && (
          <div className="flex justify-start fade-in">
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <p className="text-xs font-semibold mb-1 text-gray-600">Interviewer</p>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

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

      {/* Input Form */}
      {!interviewEnded && (
        <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your response..."
              disabled={sending}
              className="input-field flex-1"
            />
            <button
              type="submit"
              disabled={sending || !inputMessage.trim()}
              className="btn-primary px-8"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Be specific and provide examples from your experience
          </p>
        </form>
      )}
    </div>
  );
}

