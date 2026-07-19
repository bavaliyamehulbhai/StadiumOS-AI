import React from 'react';
import { MapPin, Clock, Users, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

const crowdColors = {
  Low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Critical: 'bg-red-100 text-red-700 border-red-200',
};

const SafeRouteCard = ({ safeExits }) => {
  if (!safeExits?.length) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
          <MapPin className="w-4 h-4 text-emerald-600" />
        </div>
        <h3 className="font-bold text-gray-900">Safe Exit Routes</h3>
        <span className="ml-auto text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-1 rounded-full border border-emerald-100">
          AI Ranked
        </span>
      </div>

      <div className="divide-y divide-gray-50">
        {safeExits.map((exit, i) => (
          <div key={i} className={`p-4 flex items-center gap-4 ${i === 0 ? 'bg-emerald-50/30' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
              i === 0 ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm ${i === 0 ? 'text-emerald-900' : 'text-gray-900'}`}>
                {exit.exit}
                {i === 0 && <span className="ml-2 text-xs font-medium text-emerald-600">← Recommended</span>}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{exit.reason}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-xs font-bold px-2 py-1 rounded-full border ${crowdColors[exit.crowdLevel] || crowdColors.Low}`}>
                {exit.crowdLevel}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                <Clock className="w-3 h-3" /> {exit.walkingTimeMinutes}m
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
        <Link
          to="/fan/navigation"
          className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Navigation className="w-4 h-4" /> Open Navigation
        </Link>
      </div>
    </div>
  );
};

export default SafeRouteCard;
