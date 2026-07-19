import React from 'react';

const DashboardGrid = ({ children, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 ${className}`}>
      {children}
    </div>
  );
};

export default DashboardGrid;
