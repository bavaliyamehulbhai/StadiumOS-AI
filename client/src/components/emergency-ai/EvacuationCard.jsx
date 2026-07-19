import React, { useState } from 'react';
import { DoorOpen, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

const EvacuationCard = ({ evacuationSteps, estimatedResolutionMinutes }) => {
  const [completedSteps, setCompletedSteps] = useState({});

  if (!evacuationSteps?.length) return null;

  const toggleStep = (i) => setCompletedSteps(prev => ({ ...prev, [i]: !prev[i] }));
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPct = Math.round((completedCount / evacuationSteps.length) * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-red-50 rounded-lg border border-red-100">
            <DoorOpen className="w-4 h-4 text-red-600" />
          </div>
          <h3 className="font-bold text-gray-900">Evacuation Protocol</h3>
          {estimatedResolutionMinutes && (
            <div className="ml-auto flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
              <Clock className="w-3 h-3" /> ~{estimatedResolutionMinutes} min clearance
            </div>
          )}
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-gray-500">{completedCount}/{evacuationSteps.length} steps</span>
        </div>
      </div>

      <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
        {evacuationSteps.map((step, i) => (
          <button
            key={i}
            onClick={() => toggleStep(i)}
            className={`w-full flex items-start gap-3 text-left p-3 rounded-xl border transition-all ${
              completedSteps[i]
                ? 'bg-emerald-50/50 border-emerald-100 opacity-60'
                : 'bg-gray-50 border-gray-100 hover:bg-blue-50/30 hover:border-blue-100'
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
              completedSteps[i] ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 bg-white'
            }`}>
              {completedSteps[i]
                ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                : <span className="text-xs font-bold text-gray-400">{i + 1}</span>
              }
            </div>
            <p className={`text-sm leading-relaxed flex-1 ${completedSteps[i] ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}>
              {step}
            </p>
            {!completedSteps[i] && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EvacuationCard;
