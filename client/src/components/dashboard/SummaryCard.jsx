import React from 'react';

const SummaryCard = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-6 shadow-sm ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default SummaryCard;
