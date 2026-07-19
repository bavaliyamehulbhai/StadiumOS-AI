import React from 'react';
import { AlertCircle, Users, Activity, Bot } from 'lucide-react';

const AILiveFeed = ({ insights }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'Crowd': return <Users size={16} className="text-blue-500" />;
      case 'Incident': return <AlertCircle size={16} className="text-red-500" />;
      default: return <Activity size={16} className="text-indigo-500" />;
    }
  };

  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center h-full">
        <Bot size={40} className="text-gray-200 mb-3" />
        <h3 className="text-gray-500 font-medium">Monitoring Stadium Systems</h3>
        <p className="text-sm text-gray-400 mt-1">Waiting for critical events to analyze...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <Activity size={18} className="text-indigo-500" />
          Proactive AI Feed
        </h2>
        <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Live
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-50 rounded-md">
                  {getIcon(insight.type)}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {insight.type} Intelligence
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(insight.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <p className="text-gray-800 text-sm font-medium mb-3">
              {insight.summary || insight.message || 'Analysis complete. Review recommended actions.'}
            </p>
            
            {insight.recommendation && (
              <div className="bg-indigo-50/50 rounded-md p-3 border border-indigo-100/50">
                <p className="text-xs font-semibold text-indigo-700 mb-1 flex items-center gap-1">
                  <Bot size={12} /> AI Recommendation
                </p>
                <p className="text-sm text-indigo-900 leading-relaxed">
                  {insight.recommendation}
                </p>
              </div>
            )}
            
            {insight.recommendedActions && Array.isArray(insight.recommendedActions) && (
              <div className="bg-indigo-50/50 rounded-md p-3 border border-indigo-100/50 mt-2">
                <p className="text-xs font-semibold text-indigo-700 mb-1 flex items-center gap-1">
                  <Bot size={12} /> AI Actions
                </p>
                <ul className="text-sm text-indigo-900 leading-relaxed list-disc list-inside">
                  {insight.recommendedActions.slice(0, 2).map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AILiveFeed;
