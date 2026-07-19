import React from 'react';
import { Activity, AlertTriangle, ShieldAlert, CheckCircle, BrainCircuit } from 'lucide-react';

const OperationsTimeline = ({ events }) => {
  if (!events || events.length === 0) {
    return <div className="p-4 text-center text-gray-500 font-medium">No activity yet.</div>;
  }

  const getEventIcon = (module, severity) => {
    if (module === 'AI Engine' || module === 'AI Orchestrator') return <BrainCircuit className="w-4 h-4 text-purple-500" />;
    if (severity === 'CRITICAL' || module === 'Emergency') return <ShieldAlert className="w-4 h-4 text-red-500" />;
    if (severity === 'WARNING' || module === 'Incident') return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    if (severity === 'SUCCESS') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    return <Activity className="w-4 h-4 text-blue-500" />;
  };

  const getEventColor = (module, severity) => {
    if (module === 'AI Engine' || module === 'AI Orchestrator') return 'bg-purple-50 border-purple-100';
    if (severity === 'CRITICAL' || module === 'Emergency') return 'bg-red-50 border-red-100';
    if (severity === 'WARNING' || module === 'Incident') return 'bg-orange-50 border-orange-100';
    if (severity === 'SUCCESS') return 'bg-emerald-50 border-emerald-100';
    return 'bg-white border-gray-100';
  };

  return (
    <div className="p-4 space-y-3">
      {events.map(event => (
        <div key={event._id} className={`p-3 rounded-xl border ${getEventColor(event.module, event.severity)}`}>
          <div className="flex gap-3">
            <div className="mt-0.5 shrink-0">
              {getEventIcon(event.module, event.severity)}
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex justify-between">
                <span>{event.module}</span>
                <span>{new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-sm font-bold text-gray-800 leading-snug">{event.action}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OperationsTimeline;
