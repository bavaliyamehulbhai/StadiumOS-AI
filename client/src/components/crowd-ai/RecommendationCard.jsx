import React, { useState } from 'react';
import { ArrowRightCircle, Users, Unlock, Lock, Stethoscope, Info, CheckCircle2 } from 'lucide-react';

const RecommendationCard = ({ recommendation }) => {
  const [approved, setApproved] = useState(false);

  const getIcon = () => {
    switch(recommendation.actionType) {
      case 'Redirect Crowd': return <ArrowRightCircle className="w-6 h-6 text-blue-500" />;
      case 'Deploy Volunteers': return <Users className="w-6 h-6 text-emerald-500" />;
      case 'Open Gate': return <Unlock className="w-6 h-6 text-green-500" />;
      case 'Close Gate': return <Lock className="w-6 h-6 text-red-500" />;
      case 'Medical Dispatch': return <Stethoscope className="w-6 h-6 text-rose-500" />;
      default: return <Info className="w-6 h-6 text-gray-500" />;
    }
  };

  const getPriorityColor = () => {
    switch(recommendation.priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className={`p-5 rounded-xl border ${approved ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-white border-gray-100'} shadow-sm transition-all`}>
      <div className="flex gap-4">
        <div className="mt-1 flex-shrink-0">
          <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
            {getIcon()}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-gray-900">{recommendation.actionType}</h3>
              <p className="text-sm text-gray-500 font-medium">Target: {recommendation.targetZone}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider border ${getPriorityColor()}`}>
              {recommendation.priority}
            </span>
          </div>
          
          <p className="text-gray-700 text-sm mb-4 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
            {recommendation.description}
          </p>
          
          <div className="flex justify-end">
            <button 
              onClick={() => setApproved(true)}
              disabled={approved}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${
                approved 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
            >
              {approved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Action Deployed
                </>
              ) : (
                'Approve & Deploy'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
