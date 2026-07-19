import React from 'react';
import { Navigation, X } from 'lucide-react';

const NavigationActionButtons = ({ onStart, onCancel }) => (
  <div className="flex gap-3 mt-6">
    <button onClick={onCancel} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors cursor-pointer">
      Cancel
    </button>
    <button onClick={onStart} className="flex-[2] flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all cursor-pointer">
      <Navigation size={20} /> Start Navigation
    </button>
  </div>
);
export default NavigationActionButtons;
