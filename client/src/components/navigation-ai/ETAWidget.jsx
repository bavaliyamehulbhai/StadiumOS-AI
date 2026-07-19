import React from 'react';
import { Clock } from 'lucide-react';

const ETAWidget = ({ time }) => (
  <span className="inline-flex items-center gap-1 font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm border border-blue-100">
    <Clock size={14} /> {time}
  </span>
);
export default ETAWidget;
