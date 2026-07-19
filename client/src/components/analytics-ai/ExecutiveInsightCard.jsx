import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

const ExecutiveInsightCard = ({ summary, generatedAt }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-20 blur-3xl rounded-full -translate-x-1/3 translate-y-1/3" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/30 rounded-xl border border-indigo-400/30">
              <Bot className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                Executive AI Insight <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs font-medium text-indigo-300 uppercase tracking-widest mt-0.5">
                StadiumOS Intelligence
              </p>
            </div>
          </div>
          {generatedAt && (
            <div className="text-xs font-semibold text-indigo-200/60 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
              Updated {new Date(generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        <div className="bg-black/20 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
          <p className="text-base md:text-lg text-indigo-50 font-medium leading-relaxed">
            {summary || "Loading AI insights..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveInsightCard;
