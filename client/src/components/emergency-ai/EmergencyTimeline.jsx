import React from 'react';
import { CheckCircle2, Clock, Radio, ShieldAlert, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const STEPS = [
  { key: 'Reported', label: 'Emergency Reported', icon: ShieldAlert, color: 'text-red-500 bg-red-50 border-red-200' },
  { key: 'Verified', label: 'Situation Verified', icon: CheckCircle2, color: 'text-orange-500 bg-orange-50 border-orange-200' },
  { key: 'ai_analyzed', label: 'AI Command Brief Generated', icon: Zap, color: 'text-purple-500 bg-purple-50 border-purple-200' },
  { key: 'In Progress', label: 'Teams Dispatched', icon: Radio, color: 'text-blue-500 bg-blue-50 border-blue-200' },
  { key: 'Resolved', label: 'Emergency Resolved', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
];

const EmergencyTimeline = ({ emergency, hasAIAnalysis }) => {
  const currentStatus = emergency?.status;

  const getStepStatus = (key) => {
    if (key === 'ai_analyzed') return hasAIAnalysis ? 'done' : 'pending';
    const statusOrder = ['Reported', 'Verified', 'In Progress', 'Resolved'];
    const currentIdx = statusOrder.indexOf(currentStatus);
    const stepIdx = statusOrder.indexOf(key);
    if (stepIdx < currentIdx) return 'done';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-500" /> Emergency Timeline
      </h3>
      <div className="space-y-1">
        {STEPS.map((step, i) => {
          const status = getStepStatus(step.key);
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  status === 'done' ? step.color :
                  status === 'active' ? 'border-blue-400 bg-blue-50' :
                  'border-gray-200 bg-gray-50'
                }`}>
                  <Icon className={`w-3.5 h-3.5 ${
                    status === 'done' ? '' :
                    status === 'active' ? 'text-blue-500 animate-pulse' :
                    'text-gray-300'
                  }`} />
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-0.5 h-6 mt-1 ${status === 'done' ? 'bg-blue-200' : 'bg-gray-100'}`} />
                )}
              </div>
              {/* Label */}
              <div className="pt-1.5 pb-4">
                <p className={`text-sm font-semibold ${
                  status === 'done' ? 'text-gray-900' :
                  status === 'active' ? 'text-blue-700' :
                  'text-gray-400'
                }`}>
                  {step.label}
                </p>
                {status === 'active' && (
                  <p className="text-xs text-blue-500 font-medium mt-0.5">In progress now</p>
                )}
                {status === 'done' && step.key === 'Reported' && emergency?.createdAt && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDistanceToNow(new Date(emergency.createdAt), { addSuffix: true })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyTimeline;
