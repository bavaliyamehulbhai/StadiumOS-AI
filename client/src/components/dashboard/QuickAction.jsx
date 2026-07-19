import React from 'react';
import { Link } from 'react-router-dom';

const QuickAction = ({ title, icon: Icon, to, onClick, colorClass = "text-gray-600 hover:bg-gray-50", iconColorClass = "text-gray-600" }) => {
  const content = (
    <>
      <Icon className={`w-6 h-6 mb-3 ${iconColorClass}`} />
      <span className="text-sm font-medium text-gray-900">{title}</span>
    </>
  );

  const className = `border border-gray-100 rounded-lg p-6 flex flex-col items-center justify-center transition cursor-pointer ${colorClass}`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={className}>
      {content}
    </div>
  );
};

export default QuickAction;
