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
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-100/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Header */}
      <header className="py-8 px-6 bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
                ✓
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Interview Complete
              </h1>
            </div>
            <p className="text-gray-600 ml-13">
              Performance analysis for <span className="font-semibold text-gray-900">{feedback?.role?.replace(/_/g, ' ')}</span>
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
          >
            <span>← Back to Home</span>
          </button>
        </div>
      </header>

      {/* Feedback Dashboard */}
      <main className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <FeedbackDashboard feedback={feedback} />
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 mb-8">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-800 hover:to-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transform hover:-translate-y-0.5"
            >
              🚀 Practice Again
            </button>
            <button
              onClick={() => window.print()}
              className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
            >
              📄 Download Report
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

