import React from 'react';

const roleColors = {
  Fan: 'bg-blue-100 text-blue-700',
  Organizer: 'bg-purple-100 text-purple-700',
  Volunteer: 'bg-emerald-100 text-emerald-700',
  Admin: 'bg-red-100 text-red-700',
  Default: 'bg-gray-100 text-gray-700'
};

const statusColors = {
  Active: 'text-emerald-600',
  Pending: 'text-orange-500',
  Resolved: 'text-gray-500',
  Critical: 'text-red-600 font-bold',
  Default: 'text-gray-600'
};

export const StatusBadge = ({ type = 'status', value }) => {
  if (type === 'role') {
    const colorClass = roleColors[value] || roleColors.Default;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {value}
      </span>
    );
  }

  // Text-only status
  const colorClass = statusColors[value] || statusColors.Default;
  return (
    <span className={`font-medium ${colorClass}`}>
      {value}
    </span>
  );
};
