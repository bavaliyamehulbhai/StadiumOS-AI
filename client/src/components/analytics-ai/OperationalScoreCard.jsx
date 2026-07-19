import React from 'react';
import { Activity, CheckCircle2, AlertCircle } from 'lucide-react';

const OperationalScoreCard = ({ healthScore, strengths, weaknesses }) => {
  const isExcellent = healthScore >= 85;
  const isGood = healthScore >= 70 && healthScore < 85;
  const isWarning = healthScore < 70;

  const getScoreColor = () => {
    if (isExcellent) return 'text-emerald-500';
    if (isGood) return 'text-blue-500';
    return 'text-rose-500';
  };

  const getBgColor = () => {
    if (isExcellent) return 'bg-emerald-50 border-emerald-100';
    if (isGood) return 'bg-blue-50 border-blue-100';
    return 'bg-rose-50 border-rose-100';
  };

  const strokeDasharray = 283; // 2 * PI * 45
  const strokeDashoffset = strokeDasharray - (strokeDasharray * healthScore) / 100;

  return (
    <div className={`rounded-3xl border ${getBgColor()} shadow-sm overflow-hidden flex flex-col md:flex-row relative`}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-40 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      
      {/* Left: Score Dial */}
      <div className="p-8 md:w-1/3 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-black/5 relative z-10">
        <div className="relative w-40 h-40 flex items-center justify-center mb-4">
          {/* Background circle */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="80" cy="80" r="70" className="text-black/5 stroke-current" strokeWidth="12" fill="transparent" />
            <circle 
              cx="80" cy="80" r="70" 
              className={`${getScoreColor()} stroke-current transition-all duration-1000 ease-out`} 
              strokeWidth="12" 
              fill="transparent" 
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" 
            />
          </svg>
          <div className="text-center">
            <span className={`text-4xl font-black ${getScoreColor()}`}>{healthScore}</span>
            <span className="text-sm font-bold text-gray-400">/100</span>
          </div>
        </div>
        <h3 className="font-bold text-gray-900 text-lg">Stadium Health</h3>
        <p className={`text-sm font-semibold mt-1 ${getScoreColor()}`}>
          {isExcellent ? 'Excellent Operation' : isGood ? 'Stable Operation' : 'Attention Required'}
        </p>
      </div>

      {/* Right: Breakdown */}
      <div className="p-8 md:w-2/3 flex flex-col justify-center relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <Activity className={`w-5 h-5 ${getScoreColor()}`} />
          <h3 className="font-bold text-gray-900 text-lg">AI Operational Breakdown</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Strengths */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Operational Strengths
            </h4>
            <ul className="space-y-2">
              {strengths?.length > 0 ? strengths.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 font-medium flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">•</span> {s}
                </li>
              )) : (
                <li className="text-sm text-gray-400 italic">No significant strengths detected.</li>
              )}
            </ul>
          </div>

          {/* Weaknesses */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Areas to Improve
            </h4>
            <ul className="space-y-2">
              {weaknesses?.length > 0 ? weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-gray-700 font-medium flex items-start gap-2">
                  <span className="text-rose-500 font-bold mt-0.5">•</span> {w}
                </li>
              )) : (
                <li className="text-sm text-gray-400 italic">No significant weaknesses detected.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalScoreCard;
