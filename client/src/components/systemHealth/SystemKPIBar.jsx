import React from 'react';
import { Activity, ShieldCheck, Zap, Globe, HardDrive } from 'lucide-react';

const SystemKPIBar = ({ score, api, socket, ai }) => {
  
  const getScoreColor = (s) => {
    if (s >= 90) return 'text-emerald-600 bg-emerald-50';
    if (s >= 75) return 'text-yellow-600 bg-yellow-50';
    if (s >= 50) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between overflow-x-auto">
      
      {/* Overall Score */}
      <div className="flex items-center gap-4 pr-6 border-r min-w-max">
        <div className={`p-3 rounded-full ${getScoreColor(score)}`}>
          <ShieldCheck size={28} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">System Health</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-gray-900">{score}</span>
            <span className="text-gray-400 font-medium">/ 100</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 pl-6 flex-1 min-w-max">
        <div>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
            <Activity size={14} /> Traffic
          </p>
          <p className="text-xl font-bold text-gray-900">{api?.totalRequests || 0}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
            <Zap size={14} /> API Latency
          </p>
          <p className="text-xl font-bold text-gray-900">{api?.avgLatency || 0}ms</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
            <HardDrive size={14} /> API Errors
          </p>
          <p className="text-xl font-bold text-gray-900">{api?.errorRate || 0}%</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
            <Globe size={14} /> Active Sockets
          </p>
          <p className="text-xl font-bold text-gray-900">{socket?.activeClients || 0}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
            <Activity size={14} /> AI Success
          </p>
          <p className="text-xl font-bold text-gray-900">{ai?.successRate || 100}%</p>
        </div>
      </div>
    </div>
  );
};

export default SystemKPIBar;
