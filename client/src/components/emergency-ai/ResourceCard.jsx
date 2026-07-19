import React, { useState } from 'react';
import { Users, CheckCircle2, AlertTriangle, Stethoscope, Shield, Flame, UserCheck } from 'lucide-react';

const TEAM_ICONS = {
  'Fire': Flame,
  'Medical': Stethoscope,
  'Security': Shield,
  'Volunteer': UserCheck,
  'Crowd': Users,
  'default': Users
};

const PRIORITY_STYLES = {
  Critical: 'bg-red-50 border-red-200 text-red-800',
  High: 'bg-orange-50 border-orange-200 text-orange-800',
  Medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  Low: 'bg-blue-50 border-blue-200 text-blue-800',
};

const ResourceCard = ({ resources }) => {
  const [deployed, setDeployed] = useState({});

  if (!resources?.length) return null;

  const getIcon = (teamName) => {
    const key = Object.keys(TEAM_ICONS).find(k => teamName?.includes(k));
    return TEAM_ICONS[key] || TEAM_ICONS.default;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
          <Users className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="font-bold text-gray-900">Resource Deployment Plan</h3>
      </div>

      <div className="p-4 grid grid-cols-1 gap-3">
        {resources.map((res, i) => {
          const Icon = getIcon(res.team);
          const isDeployed = deployed[i];
          return (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
              isDeployed ? 'bg-gray-50 border-gray-100 opacity-70' : 'bg-white border-gray-100 hover:border-blue-100 hover:bg-blue-50/20'
            }`}>
              <div className={`p-2 rounded-lg flex-shrink-0 ${PRIORITY_STYLES[res.priority] || PRIORITY_STYLES.Low}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-gray-900 text-sm">{res.team}</p>
                  <span className="text-xs font-black text-gray-500">×{res.count}</span>
                </div>
                <p className="text-xs text-gray-500">{res.reason}</p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${PRIORITY_STYLES[res.priority] || ''}`}>
                  {res.priority}
                </span>
                <button
                  onClick={() => setDeployed(prev => ({ ...prev, [i]: true }))}
                  disabled={isDeployed}
                  className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${
                    isDeployed
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed flex items-center gap-1'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isDeployed ? <><CheckCircle2 className="w-3 h-3" /> Deployed</> : 'Deploy'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceCard;
