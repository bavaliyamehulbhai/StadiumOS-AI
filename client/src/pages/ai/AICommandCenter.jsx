import React, { useState, useEffect } from 'react';
import { Bot, Activity, BrainCircuit } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useSocket } from '@/socket/hooks/useSocket';
import AIExecutiveBrief from '@/components/ai/AIExecutiveBrief';
import AILiveFeed from '@/components/ai/AILiveFeed';

const AICommandCenter = () => {
  const { socket } = useSocket();
  const [briefData, setBriefData] = useState({
    healthScore: 98,
    executiveSummary: 'AI Orchestrator is active. Monitoring for critical deviations...',
    interventions: 0
  });
  
  const [aiInsights, setAiInsights] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState('');

  useEffect(() => {
    if (!socket) return;

    // Listen to proactive AI recommendations
    socket.on('ai:recommendation', (insight) => {
      setAiInsights(prev => [insight, ...prev].slice(0, 15)); // Keep last 15
      
      // Update Brief
      setBriefData(prev => {
        let newScore = prev.healthScore;
        if (insight.type === 'Incident' && insight.severity === 'Critical') newScore -= 8;
        else if (insight.type === 'Crowd') newScore -= 3;
        
        return {
          healthScore: Math.max(0, newScore),
          interventions: prev.interventions + 1,
          executiveSummary: `Latest intervention: ${insight.summary || 'Proactive recommendation generated'}`
        };
      });
    });

    // Listen to AI Orchestrator status
    socket.on('ai:status', (status) => {
      setIsThinking(status.isThinking);
      setThinkingMessage(status.message);
    });

    return () => {
      socket.off('ai:recommendation');
      socket.off('ai:status');
    };
  }, [socket]);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="AI Command Center" 
        subtitle="Real-time Event Orchestration & Proactive Intelligence"
      />

      {isThinking && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="relative">
              <BrainCircuit className="text-indigo-600 animate-bounce" size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-900">AI Orchestrator is analyzing an event...</p>
              <p className="text-xs text-indigo-700">{thinkingMessage}</p>
            </div>
          </div>
          <Bot className="text-indigo-300 animate-spin-slow" size={24} />
        </div>
      )}

      {/* Top Section - Executive Brief */}
      <AIExecutiveBrief data={briefData} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        
        {/* Left Column - Live Feed */}
        <div className="lg:col-span-1 h-full">
          <AILiveFeed insights={aiInsights} />
        </div>
        
        {/* Right Column - Map / Modules */}
        <div className="lg:col-span-2 h-full bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center text-center">
            <Bot size={64} className="text-gray-100 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">Event Orchestrator Active</h3>
            <p className="text-gray-500 max-w-md mt-2">
              The AI Event Orchestrator is autonomously monitoring Socket.io streams. When critical thresholds are breached (e.g., Crowd surge or High priority incident), insights will automatically appear in the Live Feed.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AICommandCenter;
