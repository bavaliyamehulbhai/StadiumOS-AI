import React from 'react';
import { Car } from 'lucide-react';

const ParkingSuggestionCard = ({ lot, spot }) => {
  if (!lot) return null;
  return (
    <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-4">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
        <Car size={20} />
      </div>
      <div>
        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Your Reserved Parking</p>
        <p className="text-gray-900 font-bold text-lg">{lot} {spot ? `• Spot ${spot}` : ''}</p>
      </div>
    </div>
  );
};
export default ParkingSuggestionCard;
