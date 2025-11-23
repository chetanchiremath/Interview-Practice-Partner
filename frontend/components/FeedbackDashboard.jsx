// Feedback Dashboard Component - Displays comprehensive interview feedback
'use client';

export default function FeedbackDashboard({ feedback }) {
  if (!feedback) return null;

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getRecommendationBadge = (recommendation) => {
    const badges = {
      STRONG_HIRE: { text: 'Strong Hire', color: 'bg-green-500' },
      HIRE: { text: 'Hire', color: 'bg-green-400' },
      MAYBE: { text: 'Maybe', color: 'bg-yellow-500' },
      NO_HIRE: { text: 'No Hire', color: 'bg-red-500' },
    };
    
    const badge = badges[recommendation] || badges.MAYBE;
    
    return (
      <span className={`${badge.color} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <div className="card text-center fade-in">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Overall Performance</h2>
        <div className={`text-6xl font-bold mb-4 ${getScoreColor(feedback.overallScore)}`}>
          {feedback.overallScore}/10
        </div>
        <div className="mb-4">
          {getRecommendationBadge(feedback.recommendation)}
        </div>
        <p className="text-gray-600">
          Duration: {feedback.duration} • Questions: {feedback.questionCount}
        </p>
      </div>

      {/* Score Breakdown */}
      <div className="card fade-in">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Score Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(feedback.scores || {}).map(([category, score]) => (
            <div key={category} className="text-center">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${getScoreBackground(score)} ${getScoreColor(score)} mb-2`}>
                {score}
              </div>
              <p className="text-sm font-semibold text-gray-700 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div className="card fade-in">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-green-600">✓</span> Strengths
        </h2>
        <ul className="space-y-3">
          {feedback.strengths?.map((strength, index) => (
            <li key={index} className="flex gap-3">
              <span className="text-green-500 font-bold">•</span>
              <span className="text-gray-700">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Areas for Improvement */}
      <div className="card fade-in">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-yellow-600">⚠</span> Areas for Improvement
        </h2>
        <ul className="space-y-3">
          {feedback.improvements?.map((improvement, index) => (
            <li key={index} className="flex gap-3">
              <span className="text-yellow-500 font-bold">•</span>
              <span className="text-gray-700">{improvement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Highlights */}
      {feedback.highlights && feedback.highlights.length > 0 && (
        <div className="card fade-in bg-gradient-to-r from-purple-50 to-blue-50">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>⭐</span> Interview Highlights
          </h2>
          <ul className="space-y-3">
            {feedback.highlights.map((highlight, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-purple-500 font-bold">•</span>
                <span className="text-gray-700">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Red Flags */}
      {feedback.redFlags && feedback.redFlags.length > 0 && (
        <div className="card fade-in bg-red-50 border-red-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-red-600">⚠️</span> Points of Concern
          </h2>
          <ul className="space-y-3">
            {feedback.redFlags.map((flag, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-red-500 font-bold">•</span>
                <span className="text-gray-700">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Overall Feedback */}
      <div className="card fade-in">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Feedback</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {feedback.overallFeedback}
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="card fade-in bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Next Steps</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• Review the improvement areas and practice addressing them</li>
          <li>• Research common questions for {feedback.role?.replace(/_/g, ' ')} positions</li>
          <li>• Practice using the STAR method (Situation, Task, Action, Result)</li>
          <li>• Do another mock interview to track your progress</li>
          <li>• Record yourself answering questions to improve delivery</li>
        </ul>
      </div>
    </div>
  );
}

