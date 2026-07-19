import React from 'react';
import { CornerUpRight, ArrowUp, CornerUpLeft, CheckCircle2 } from 'lucide-react';

const RouteInstructions = ({ activeRoute }) => {
  if (!activeRoute || !activeRoute.instructions) return null;

  const getInstructionIcon = (instruction) => {
    if (instruction.includes('Right')) return <CornerUpRight className="w-4 h-4 text-blue-600" />;
    if (instruction.includes('Left')) return <CornerUpLeft className="w-4 h-4 text-blue-600" />;
    if (instruction.includes('Destination') || instruction.includes('straight')) return <ArrowUp className="w-4 h-4 text-blue-600" />;
    return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-4 w-[320px] max-w-sm max-h-40 overflow-y-auto mt-3">
      <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-3">Step-by-Step Directions</h4>
      
      <div className="space-y-3">
        {activeRoute.instructions.map((step, idx) => (
          <div key={idx} className="flex gap-3 items-start">
            <div className="mt-0.5 p-1.5 bg-blue-50 rounded-full shrink-0">
              {getInstructionIcon(step)}
            </div>
            <p className="text-sm text-gray-700 leading-snug pt-1 border-b border-gray-50 pb-3 w-full">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteInstructions;
