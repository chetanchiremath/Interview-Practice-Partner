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
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col z-20 shadow-xl shadow-gray-200/50">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary-500/20">
              AI
            </div>
            <h1 className="font-bold text-gray-900 tracking-tight">Interview Session</h1>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-green-600 uppercase tracking-wider">Live Session</span>
          </div>
        </div>

        {/* Session Info */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                Current Role
              </label>
              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                <div className="text-2xl mb-2">💼</div>
                <h3 className="font-bold text-primary-900">
                  {sessionData?.role?.replace(/_/g, ' ')}
                </h3>
                <p className="text-xs text-primary-600 mt-1">
                  Mock Interview
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                Interaction Mode
              </label>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-lg">
                  {mode === 'voice' ? '🎤' : '💬'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {mode === 'voice' ? 'Voice Mode' : 'Chat Mode'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {mode === 'voice' ? 'Speaking & Listening' : 'Text-based Chat'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={handleEndInterview}
            className="w-full py-3 px-4 bg-white border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all shadow-sm flex items-center justify-center gap-2 group"
          >
            <span>End Session</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-100/40 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        </div>

        {/* Interface Container */}
        <div className="flex-1 p-6 md:p-8 overflow-hidden">
          <div className="h-full max-w-5xl mx-auto bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-2xl shadow-gray-200/50 overflow-hidden relative">
            {mode === 'voice' ? (
              <VoiceInterface sessionId={sessionId} onEnd={handleEndInterview} />
            ) : (
              <ChatInterface sessionId={sessionId} onEnd={handleEndInterview} />
            )}
          </div>
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

