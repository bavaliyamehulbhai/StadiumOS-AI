import React from 'react';

const POI_TYPES = [
  { type: 'Gate', icon: '🚪' },
  { type: 'Parking', icon: '🅿' },
  { type: 'FoodCourt', icon: '🍔' },
  { type: 'Medical', icon: '🏥' },
  { type: 'Washroom', icon: '🚻' },
  { type: 'EmergencyExit', icon: '🚨' }
];

const FilterPanel = ({ activeFilters, onChange }) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 p-3 flex flex-wrap gap-2 max-w-lg">
      <div className="w-full text-xs font-semibold text-gray-500 mb-1 px-1">Filter Facilities</div>
      {POI_TYPES.map((poi) => (
        <button
          key={poi.type}
          onClick={() => onChange(poi.type)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeFilters.includes(poi.type)
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span>{poi.icon}</span>
          {poi.type.replace(/([A-Z])/g, ' $1').trim()}
        </button>
      ))}
    </div>
  );
};

export default FilterPanel;
