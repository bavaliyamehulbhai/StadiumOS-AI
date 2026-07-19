import React from 'react';
import { Bot, RefreshCw } from 'lucide-react';
import CrowdInsightCard from './CrowdInsightCard';
import RiskPredictionCard from './RiskPredictionCard';
import RecommendationCard from './RecommendationCard';

const AIAnalysisPanel = ({ aiData, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <Bot className="w-12 h-12 text-blue-500 animate-pulse relative z-10" />
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-30 animate-ping"></div>
        </div>
        <h3 className="mt-6 text-lg font-bold text-gray-900">AI is Analyzing the Stadium...</h3>
        <p className="text-gray-500 mt-2 text-center max-w-sm">
          Processing live crowd density, open incidents, and parking availability.
        </p>
      </div>
    );
  }

  if (!aiData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">AI Crowd Intelligence</h3>
        <p className="text-gray-500 mb-6">No data available or generation failed.</p>
        <button onClick={onRefresh} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Retry Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" /> Operational Intelligence
        </h2>
        <button 
          onClick={onRefresh}
          className="text-gray-500 hover:text-blue-600 flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Main High-Level Summary Card */}
      <CrowdInsightCard 
        summary={aiData.summary}
        riskLevel={aiData.overallRiskLevel}
        confidence={aiData.confidence}
      />

      {/* Risk Predictions Row */}
      {aiData.predictions && aiData.predictions.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Critical Risk Predictions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiData.predictions.map((pred, i) => (
              <RiskPredictionCard key={i} prediction={pred} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Actions Row */}
      {aiData.recommendations && aiData.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 mt-6">Recommended Actions</h3>
          <div className="grid grid-cols-1 gap-4">
            {aiData.recommendations.map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalysisPanel;
