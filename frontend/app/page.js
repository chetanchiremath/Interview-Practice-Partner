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
    <div className="min-h-screen flex flex-col bg-gray-50/50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-200/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Header */}
      <header className="py-6 px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
            AI
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Interview Partner</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section - Compact */}
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">AI Interview Coach</span>
            </h1>
            <p className="text-lg text-gray-600">
              Select a role below to start your realistic mock interview session.
            </p>
          </div>

          {/* Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Role Selection (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Select Role
                </h2>
                <span className="text-sm text-gray-500">{roles.length} roles available</span>
              </div>
              
              <RoleSelector
                roles={roles}
                selectedRole={selectedRole}
                onSelectRole={setSelectedRole}
              />
            </div>

            {/* Right Column: Configuration Panel (4 cols) */}
            <div className="lg:col-span-4 sticky top-6">
              <div className="card bg-white/80 backdrop-blur-xl border-white/40 shadow-2xl shadow-primary-900/5 p-6 rounded-3xl">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  Configuration
                </h2>

                {/* Mode Selection */}
                <div className="space-y-4 mb-8">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Interaction Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setInteractionMode('voice')}
                      className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                        interactionMode === 'voice'
                          ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm ring-1 ring-primary-500'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-primary-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">🎤</div>
                      <div className="font-semibold text-sm">Voice</div>
                    </button>
                    <button
                      onClick={() => setInteractionMode('chat')}
                      className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                        interactionMode === 'chat'
                          ? 'bg-primary-50 border-primary-500 text-primary-700 shadow-sm ring-1 ring-primary-500'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-primary-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">💬</div>
                      <div className="font-semibold text-sm">Chat</div>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 px-1">
                    {interactionMode === 'voice' 
                      ? 'Best for practicing speaking confidence and pacing.' 
                      : 'Best for structuring thoughtful written responses.'}
                  </p>
                </div>

                {/* Summary & Start */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Selected Role:</span>
                      <span className="font-medium text-gray-900">
                        {roles.find(r => r.id === selectedRole)?.name || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Mode:</span>
                      <span className="font-medium text-gray-900 capitalize">{interactionMode}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleStartInterview}
                    disabled={!selectedRole || loading}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-primary-500/25 transition-all transform active:scale-95 ${
                      !selectedRole || loading
                        ? 'bg-gray-300 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 hover:shadow-primary-500/40'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Starting...
                      </span>
                    ) : (
                      'Start Interview'
                    )}
                  </button>
                  
                  {!selectedRole && (
                    <p className="text-center text-xs text-gray-400 mt-3">
                      Please select a role to continue
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 text-center text-sm text-gray-400">
        <p>Empowering your career journey with AI</p>
      </footer>
    </div>
  );
}

