// Feedback Dashboard Component - Displays comprehensive interview feedback
'use client';

export default function FeedbackDashboard({ feedback }) {
  if (!feedback) return null;

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 6) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 8) return 'bg-emerald-50 border-emerald-200';
    if (score >= 6) return 'bg-amber-50 border-amber-200';
    return 'bg-rose-50 border-rose-200';
  };

  const getRecommendationBadge = (recommendation) => {
    const badges = {
      STRONG_HIRE: { text: 'Strong Hire', color: 'bg-emerald-600', icon: '🌟' },
      HIRE: { text: 'Hire', color: 'bg-emerald-500', icon: '✓' },
      MAYBE: { text: 'Maybe', color: 'bg-amber-500', icon: '~' },
      NO_HIRE: { text: 'No Hire', color: 'bg-rose-500', icon: '✗' },
    };
    
    const badge = badges[recommendation] || badges.MAYBE;
    
    return (
      <span className={`${badge.color} text-white px-5 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-lg`}>
        <span>{badge.icon}</span>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero Score Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-lg font-semibold text-gray-500 mb-2 uppercase tracking-wider">Overall Score</h2>
              <div className={`text-7xl font-black mb-4 ${getScoreColor(feedback.overallScore)}`}>
                {feedback.overallScore}<span className="text-4xl text-gray-400">/10</span>
              </div>
              <div className="mb-4">
                {getRecommendationBadge(feedback.recommendation)}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {feedback.duration}
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {feedback.questionCount} questions
                </span>
              </div>
            </div>

            {/* Score Breakdown Mini Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(feedback.scores || {}).slice(0, 6).map(([category, score]) => (
                <div key={category} className={`p-4 rounded-xl border ${getScoreBackground(score)} text-center min-w-[100px]`}>
                  <div className={`text-2xl font-bold ${getScoreColor(score)} mb-1`}>
                    {score}
                  </div>
                  <p className="text-xs font-medium text-gray-700 capitalize leading-tight">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Strengths</h2>
          </div>
          <ul className="space-y-3">
            {feedback.strengths?.map((strength, index) => (
              <li key={index} className="flex gap-3 items-start">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <span className="text-gray-700 leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Areas to Improve</h2>
          </div>
          <ul className="space-y-3">
            {feedback.improvements?.map((improvement, index) => (
              <li key={index} className="flex gap-3 items-start">
                <span className="text-amber-500 font-bold mt-0.5">→</span>
                <span className="text-gray-700 leading-relaxed">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Highlights */}
      {feedback.highlights && feedback.highlights.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Interview Highlights</h2>
          </div>
          <ul className="space-y-3">
            {feedback.highlights.map((highlight, index) => (
              <li key={index} className="flex gap-3 items-start">
                <span className="text-blue-500 font-bold mt-0.5">★</span>
                <span className="text-gray-700 leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Red Flags */}
      {feedback.redFlags && feedback.redFlags.length > 0 && (
        <div className="bg-rose-50 rounded-2xl border border-rose-200 shadow-lg shadow-rose-200/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Points of Concern</h2>
          </div>
          <ul className="space-y-3">
            {feedback.redFlags.map((flag, index) => (
              <li key={index} className="flex gap-3 items-start">
                <span className="text-rose-500 font-bold mt-0.5">!</span>
                <span className="text-gray-700 leading-relaxed">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Overall Feedback */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Detailed Feedback
        </h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {feedback.overallFeedback}
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl border border-primary-100 shadow-lg shadow-primary-200/50 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Next Steps
        </h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-primary-600 font-bold mt-0.5">1.</span>
            <span>Review the improvement areas and practice addressing them</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary-600 font-bold mt-0.5">2.</span>
            <span>Research common questions for {feedback.role?.replace(/_/g, ' ')} positions</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary-600 font-bold mt-0.5">3.</span>
            <span>Practice using the STAR method (Situation, Task, Action, Result)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary-600 font-bold mt-0.5">4.</span>
            <span>Do another mock interview to track your progress</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary-600 font-bold mt-0.5">5.</span>
            <span>Record yourself answering questions to improve delivery</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
