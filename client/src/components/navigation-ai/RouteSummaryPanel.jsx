import React from 'react';
import { useAuth } from '../../context/AuthContext';

const RouteSummaryPanel = ({ destination }) => {
  const { user } = useAuth();
  
  return (
    <div className="mb-6">
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Destination</p>
      <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">{destination}</h2>
      <p className="text-sm text-blue-600 mt-1 font-medium">AI Optimized for {user?.role || 'Guest'}</p>
    </div>
  );
};
export default RouteSummaryPanel;
