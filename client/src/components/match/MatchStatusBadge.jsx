import React from 'react';

const MatchStatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Live':
        return 'bg-green-100 text-green-700 border-green-200 animate-pulse';
      case 'Completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Postponed':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor()}`}>
      {status === 'Live' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 mb-0.5"></span>}
      {status}
    </span>
  );
};

export default MatchStatusBadge;
