// Interview Page - Main interview interface
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VoiceInterface from '../../components/VoiceInterface';
import ChatInterface from '../../components/ChatInterface';
import api from '../../lib/api';

function InterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  const mode = searchParams.get('mode') || 'chat';

  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
      return;
    }

    fetchSessionData();
  }, [sessionId]);

  async function fetchSessionData() {
    try {
      const response = await api.get(`/interview/session/${sessionId}`);
      setSessionData(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch session:', err);
      if (err.response?.status === 404) {
        setError('Interview session not found. The server may have been restarted. Please start a new interview.');
      } else {
        setError('Failed to load interview session. Please try again.');
      }
      setLoading(false);
    }
  }

  async function handleEndInterview() {
    const confirmed = window.confirm('Are you sure you want to end the interview?');
    if (!confirmed) return;

    try {
      await api.post('/interview/end', { sessionId });
      router.push(`/feedback?session=${sessionId}`);
    } catch (err) {
      console.error('Failed to end interview:', err);
      alert('Failed to end interview. Please try again.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button onClick={() => router.push('/')} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Interview: {sessionData?.role?.replace(/_/g, ' ')}
            </h1>
            <p className="text-sm text-gray-600">
              Mode: {mode === 'voice' ? '🎤 Voice' : '💬 Chat'}
            </p>
          </div>
          <button
            onClick={handleEndInterview}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
          >
            End Interview
          </button>
        </div>
      </header>

      {/* Main Interview Interface */}
      <main className="flex-1 py-6 px-4">
        <div className="max-w-4xl mx-auto h-full">
          {mode === 'voice' ? (
            <VoiceInterface sessionId={sessionId} onEnd={handleEndInterview} />
          ) : (
            <ChatInterface sessionId={sessionId} onEnd={handleEndInterview} />
          )}
        </div>
      </main>
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <InterviewContent />
    </Suspense>
  );
}

