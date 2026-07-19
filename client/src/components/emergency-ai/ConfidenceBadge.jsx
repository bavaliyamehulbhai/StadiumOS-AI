import React from 'react';

const ConfidenceBadge = ({ confidence, aiModel }) => {
  const isFallback = aiModel === 'deterministic-fallback';
  const color = confidence >= 90 ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
    : confidence >= 75 ? 'text-blue-600 bg-blue-50 border-blue-200'
    : confidence >= 60 ? 'text-amber-600 bg-amber-50 border-amber-200'
    : 'text-gray-600 bg-gray-50 border-gray-200';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${color}`}>
      <div className={`w-2 h-2 rounded-full ${confidence >= 75 ? 'bg-current' : 'bg-current opacity-60'} animate-pulse`} />
      {isFallback ? 'Pattern-Based' : 'AI Powered'} · {confidence}% confidence
    </div>
  );
};

export default ConfidenceBadge;
