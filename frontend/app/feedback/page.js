// Feedback Page - Display interview feedback and results
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FeedbackDashboard from '../../components/FeedbackDashboard';
import api from '../../lib/api';

function FeedbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
      return;
    }

    generateFeedback();
  }, [sessionId]);

  async function generateFeedback() {
    try {
      setLoading(true);
      
      const response = await api.post('/feedback/generate', {
        sessionId,
        quick: false,
      });

      setFeedback(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to generate feedback:', err);
      setError('Failed to generate feedback. Please try again.');
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analyzing Your Interview...
          </h2>
          <p className="text-gray-600">
            Our AI is carefully reviewing your responses and preparing detailed feedback.
          </p>
          <p className="text-gray-500 text-sm mt-2">This may take 10-20 seconds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button onClick={() => router.push('/')} className="btn-primary">
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-6 px-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            📊 Interview Feedback
          </h1>
          <p className="text-gray-600 mt-2">
            Here's how you performed in your {feedback?.role?.replace(/_/g, ' ')} interview
          </p>
        </div>
      </header>

      {/* Feedback Dashboard */}
      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <FeedbackDashboard feedback={feedback} />
          
          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              Practice Again
            </button>
            <button
              onClick={() => window.print()}
              className="btn-secondary"
            >
              📄 Print Report
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <FeedbackContent />
    </Suspense>
  );
}

