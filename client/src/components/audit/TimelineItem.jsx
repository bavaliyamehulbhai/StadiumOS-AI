import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertCircle, Info, Bot, User, Map, Activity, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

const TimelineItem = ({ log, isLast }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500 text-white border-red-200';
      case 'ERROR': return 'bg-orange-500 text-white border-orange-200';
      case 'WARNING': return 'bg-amber-400 text-amber-900 border-amber-200';
      case 'SUCCESS': return 'bg-emerald-500 text-white border-emerald-200';
      default: return 'bg-blue-500 text-white border-blue-200';
    }
  };

  const getModuleIcon = (module, aiGenerated) => {
    if (aiGenerated) return <Bot size={16} />;
    switch (module) {
      case 'Authentication': return <User size={16} />;
      case 'Incident': return <AlertTriangle size={16} />;
      case 'Crowd': return <Users size={16} />;
      case 'Emergency': return <ShieldAlert size={16} />;
      case 'Map': return <Map size={16} />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <div className="flex gap-4 relative">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute top-10 left-5 w-px h-full bg-gray-200 -z-10" />
      )}
      
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 shadow-sm z-10 ${getSeverityColor(log.severity)}`}>
        {getModuleIcon(log.module, log.aiGenerated)}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{log.module}</span>
                {log.aiGenerated && (
                  <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Bot size={10} /> AI DECISION
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{log.action}</h3>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} />
                {format(new Date(log.createdAt), 'HH:mm:ss')}
              </div>
              <div className="text-xs text-gray-300 mt-1">{format(new Date(log.createdAt), 'MMM dd, yyyy')}</div>
            </div>
          </div>
          
          {log.user && (
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 py-1.5 px-3 rounded-lg w-fit mt-3">
              <span className="font-medium text-gray-700">{log.user.name}</span>
              <span className="bg-gray-200 w-1 h-1 rounded-full"></span>
              <span>{log.user.role}</span>
            </div>
          )}

          {log.metadata && log.metadata.body && Object.keys(log.metadata.body).length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100 font-mono text-[10px] text-gray-600 overflow-x-auto">
              <pre>{JSON.stringify(log.metadata.body, null, 2)}</pre>
            </div>
          )}
          
          {log.metadata && log.metadata.recommendedActions && (
            <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <h4 className="text-xs font-bold text-purple-800 mb-1">AI Recommended Actions</h4>
              <ul className="list-disc list-inside text-xs text-purple-700 space-y-1">
                {log.metadata.recommendedActions.map((act, i) => (
                  <li key={i}>{typeof act === 'string' ? act : act.actionType}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
