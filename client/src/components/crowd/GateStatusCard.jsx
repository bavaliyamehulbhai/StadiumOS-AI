import React from 'react';
import { Users, Clock } from 'lucide-react';

const GateStatusCard = ({ gate }) => {
  const getProgressColor = (density) => {
    if (density <= 40) return 'bg-green-500';
    if (density <= 70) return 'bg-yellow-500';
    if (density <= 90) return 'bg-orange-500';
    return 'bg-red-600';
  };

  const getTextColor = (density) => {
    if (density <= 40) return 'text-green-600';
    if (density <= 70) return 'text-yellow-600';
    if (density <= 90) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50/50">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-gray-900">{gate.zone}</h4>
        <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white border ${getTextColor(gate.densityPercentage)}`}>
          {gate.riskLevel}
        </span>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Occupancy</span>
          <span className="font-medium">{gate.densityPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor(gate.densityPercentage)}`} 
            style={{ width: `${gate.densityPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-600 border-t pt-2 border-gray-200">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3 text-gray-400" />
          {gate.currentPeople} / {gate.maxCapacity}
        </span>
        <span className="flex items-center gap-1 font-medium text-gray-700">
          <Clock className="w-3 h-3 text-gray-400" />
          {gate.averageWaitTime} min wait
        </span>
      </div>
    </div>
  );
};

export default GateStatusCard;
