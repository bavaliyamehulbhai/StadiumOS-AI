import React from 'react';
import { Users, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

const CrowdInsightCard = ({ riskLevel, confidence, summary }) => {
  const getRiskColor = () => {
    switch(riskLevel) {
      case 'Critical': return 'from-red-500 to-rose-600 shadow-red-500/20';
      case 'High': return 'from-orange-400 to-red-500 shadow-orange-500/20';
      case 'Medium': return 'from-yellow-400 to-orange-400 shadow-yellow-500/20';
      default: return 'from-emerald-400 to-green-500 shadow-emerald-500/20';
    }
  };

  const Icon = riskLevel === 'Critical' || riskLevel === 'High' ? AlertTriangle : ShieldCheck;

  return (
    <div className={`bg-gradient-to-br ${getRiskColor()} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden`}>
      {/* Decorative background element */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-black opacity-10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wider uppercase">Live Insight</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium opacity-80">Confidence</div>
            <div className="text-xl font-bold">{confidence}%</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black">{riskLevel} Risk</h2>
            <p className="text-sm opacity-90">Overall Stadium Status</p>
          </div>
        </div>

        <div className="bg-black/10 rounded-xl p-4 mt-2 border border-white/10">
          <p className="text-base font-medium leading-relaxed">
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrowdInsightCard;
