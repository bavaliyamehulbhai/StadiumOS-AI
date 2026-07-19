import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecommendationCard = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Critical': return 'border-l-red-500 bg-red-50/50';
      case 'High': return 'border-l-orange-500 bg-orange-50/50';
      case 'Medium': return 'border-l-yellow-400 bg-yellow-50/50';
      default: return 'border-l-blue-400 bg-blue-50/50';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-xl border border-amber-200">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="font-bold text-gray-900">Recommended Actions</h3>
        </div>
      </div>

      <div className="p-6 flex-1 space-y-4">
        {recommendations.map((rec, i) => (
          <div key={i} className={`p-4 rounded-xl border-l-4 border-t border-r border-b border-gray-100 ${getPriorityStyle(rec.priority)}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-gray-900 text-sm leading-snug">{rec.action}</h4>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                rec.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                rec.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-200 text-gray-700'
              }`}>
                {rec.priority}
              </span>
            </div>
            <p className="text-xs font-medium text-gray-600 mb-3">{rec.reason}</p>
            
            <Link to="/organizer/tasks/assign" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
              Assign to Team <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCard;
