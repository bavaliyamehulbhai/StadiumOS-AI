import React from 'react';
import { Clock, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

const RiskPredictionCard = ({ prediction }) => {
  const isCritical = prediction.risk === 'Critical' || prediction.risk === 'High';

  return (
    <div className={`p-5 rounded-xl border ${isCritical ? 'bg-red-50/50 border-red-100' : 'bg-white border-gray-100'} shadow-sm relative overflow-hidden group`}>
      {isCritical && (
        <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{prediction.zone}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${isCritical ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
              {prediction.risk} Risk
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
            <Clock className="w-4 h-4" /> in {prediction.timeframeMinutes}m
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-500 uppercase font-semibold">Current</p>
          <p className="text-xl font-bold text-gray-900">{prediction.currentDensity}%</p>
        </div>
        <div className="flex items-center justify-center text-gray-300">
          <ArrowRight className="w-6 h-6" />
        </div>
        <div className={`p-3 rounded-lg border ${isCritical ? 'bg-red-100/50 border-red-200 text-red-700' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
          <p className="text-xs uppercase font-semibold">Predicted</p>
          <p className="text-xl font-bold">{prediction.predictedDensity}%</p>
        </div>
      </div>

      <div className="flex gap-3 items-start bg-white p-3 rounded-lg border border-gray-100">
        <AlertCircle className={`w-5 h-5 flex-shrink-0 ${isCritical ? 'text-red-500' : 'text-blue-500'}`} />
        <p className="text-sm text-gray-700">{prediction.reasoning}</p>
      </div>
    </div>
  );
};

export default RiskPredictionCard;
