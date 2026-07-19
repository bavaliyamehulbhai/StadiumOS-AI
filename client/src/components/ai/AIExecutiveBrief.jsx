import React from 'react';
import { ShieldCheck, AlertTriangle, ArrowUpRight, ArrowDownRight, Bot } from 'lucide-react';

const AIExecutiveBrief = ({ data }) => {
  if (!data) return null;
  
  const healthScore = data.healthScore || 100;
  const isHealthy = healthScore >= 85;

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Bot size={120} />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-500/30 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm">
              Live AI Brief
            </span>
            <span className="flex items-center gap-1 text-xs text-indigo-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-time Analysis
            </span>
          </div>
          
          <h1 className="text-3xl font-black mb-4 leading-tight">
            Stadium Operations are running <span className={isHealthy ? 'text-emerald-400' : 'text-amber-400'}>{isHealthy ? 'Smoothly' : 'with Warnings'}</span>.
          </h1>
          
          <p className="text-indigo-200 text-lg leading-relaxed max-w-2xl mb-6">
            {data.executiveSummary || 'AI Orchestrator is monitoring crowd flow, incident reports, and volunteer deployments across the venue.'}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isHealthy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {isHealthy ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div>
                <p className="text-sm text-indigo-200 font-medium">Health Score</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black">{healthScore}</span>
                  <span className="text-sm mb-1 text-emerald-400 flex items-center">
                    <ArrowUpRight size={14} /> 2%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                <Bot size={24} />
              </div>
              <div>
                <p className="text-sm text-indigo-200 font-medium">AI Interventions</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black">{data.interventions || 0}</span>
                  <span className="text-sm mb-1 text-indigo-300">today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIExecutiveBrief;
