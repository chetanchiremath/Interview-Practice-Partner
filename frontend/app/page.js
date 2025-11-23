// Landing Page - Home page with role selection
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RoleSelector from '../components/RoleSelector';
import api from '../lib/api';

export default function Home() {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [interactionMode, setInteractionMode] = useState('chat');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch available roles on mount
  useEffect(() => {
    fetchRoles();
  }, []);

  async function fetchRoles() {
    try {
      const response = await api.get('/feedback/roles');
      setRoles(response.data.data);
    } catch (err) {
      console.error('Failed to fetch roles:', err);
      setError('Failed to load roles. Please refresh the page.');
    }
  }

  async function handleStartInterview() {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/interview/start', {
        role: selectedRole,
        interactionMode,
      });

      const { sessionId } = response.data.data;

      // Navigate to interview page with session ID
      router.push(`/interview?session=${sessionId}&mode=${interactionMode}`);
    } catch (err) {
      console.error('Failed to start interview:', err);
      setError('Failed to start interview. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            🎯 Interview Practice Partner
          </h1>
          <p className="text-gray-600 mt-2">
            Prepare for your dream job with AI-powered mock interviews
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Introduction Card */}
          <div className="card mb-8 fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome! Let's Get You Interview-Ready 🚀
            </h2>
            <p className="text-gray-700 mb-4">
              Our AI interviewer will conduct a realistic mock interview tailored to your chosen role.
              You'll receive personalized feedback to help you improve.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Realistic interview questions specific to your role</li>
              <li>Natural follow-up questions like a real interviewer</li>
              <li>Detailed feedback on your performance</li>
              <li>Voice or chat interaction - your choice!</li>
            </ul>
          </div>

          {/* Role Selection */}
          <div className="card mb-8 fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Step 1: Choose Your Role
            </h2>
            
            <RoleSelector
              roles={roles}
              selectedRole={selectedRole}
              onSelectRole={setSelectedRole}
            />
          </div>

          {/* Interaction Mode Selection */}
          {selectedRole && (
            <div className="card mb-8 fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Step 2: Choose Interaction Mode
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Voice Mode */}
                <button
                  onClick={() => setInteractionMode('voice')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    interactionMode === 'voice'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-3">🎤</div>
                  <h3 className="text-lg font-semibold mb-2">Voice Mode</h3>
                  <p className="text-sm text-gray-600">
                    Speak naturally like a real interview. Recommended for best practice experience.
                  </p>
                </button>

                {/* Chat Mode */}
                <button
                  onClick={() => setInteractionMode('chat')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    interactionMode === 'chat'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-3">💬</div>
                  <h3 className="text-lg font-semibold mb-2">Chat Mode</h3>
                  <p className="text-sm text-gray-600">
                    Type your responses. Great for thinking through your answers carefully.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="card mb-8 bg-red-50 border-red-200 fade-in">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Start Button */}
          {selectedRole && (
            <div className="text-center fade-in">
              <button
                onClick={handleStartInterview}
                disabled={loading}
                className="btn-primary text-lg px-12 py-4"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Starting Interview...
                  </span>
                ) : (
                  `Start ${interactionMode === 'voice' ? '🎤' : '💬'} Interview`
                )}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-sm">
          <p>Built with ❤️ using OpenAI GPT-4 • Practice makes perfect!</p>
        </div>
      </footer>
    </div>
  );
}

