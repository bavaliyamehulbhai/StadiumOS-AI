import React from 'react';

const MapLegend = () => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 p-4 w-48">
      <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Legend</h4>
      <div className="space-y-2.5">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs">🏟</span>
          Main Stadium
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs">🚪</span>
          Entry Gates
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs">🚨</span>
          Emergency Exits
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs">♿</span>
          Accessibility
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
