import React from 'react';
import { AlertTriangle } from 'lucide-react';

const RouteWarningBanner = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg flex items-start gap-3 mb-4">
      <AlertTriangle size={20} className="mt-0.5 shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};
export default RouteWarningBanner;
