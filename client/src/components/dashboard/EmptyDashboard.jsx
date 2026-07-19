import React from 'react';
import { LayoutGrid } from 'lucide-react';

const EmptyDashboard = ({ title = "No Data Available", message = "There is currently no data to display on this dashboard." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <LayoutGrid className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-sm">{message}</p>
    </div>
  );
};

export default EmptyDashboard;
