import React from 'react';
import { Radar, Clock, AlertTriangle } from 'lucide-react';

const PredictionCard = ({ predictions }) => {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-50 rounded-xl">
            <Radar className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-bold text-gray-900">AI Predictions</h3>
        </div>
        <p className="text-sm text-gray-500 italic">No significant predictions generated at this time.</p>
      </div>
    );
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'Critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'High': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-xl border border-purple-200">
            <Radar className="w-5 h-5 text-purple-600 animate-pulse" />
          </div>
          <h3 className="font-bold text-gray-900">AI Predictions</h3>
        </div>
        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-lg border border-purple-100">
          Forecasting
        </span>
      </div>

      <div className="p-6 flex-1">
        <div className="space-y-4">
          {predictions.map((p, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-purple-200 hover:shadow-md transition-all">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-400">{p.category}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getImpactColor(p.impact)}`}>
                    {p.impact} Impact
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-2">{p.issue}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 w-fit px-2.5 py-1 rounded-md border border-gray-100">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {p.timeframe}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
