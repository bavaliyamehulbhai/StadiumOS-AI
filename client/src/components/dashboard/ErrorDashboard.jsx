import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorDashboard = ({ title = "Unable to load dashboard.", message = "Please check your network connection or try again later.", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-red-50/50 rounded-2xl border border-red-100 p-8 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-md mb-8">{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorDashboard;
