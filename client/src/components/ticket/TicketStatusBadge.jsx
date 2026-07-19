import React from 'react';

const TicketStatusBadge = ({ status }) => {
  let styles = "bg-gray-100 text-gray-800";
  
  switch (status) {
    case 'Confirmed':
      styles = "bg-green-100 text-green-800";
      break;
    case 'Booked':
      styles = "bg-blue-100 text-blue-800";
      break;
    case 'Checked-In':
      styles = "bg-purple-100 text-purple-800";
      break;
    case 'Used':
      styles = "bg-gray-200 text-gray-500";
      break;
    case 'Cancelled':
      styles = "bg-red-100 text-red-800";
      break;
    case 'Expired':
      styles = "bg-yellow-100 text-yellow-800";
      break;
    default:
      break;
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
};

export default TicketStatusBadge;
