import React from 'react';
import { Users } from 'lucide-react';
import './NavigationAI.css';

const CrowdIndicator = ({ level }) => {
  const getStyles = () => {
    switch (level) {
      case 'High': return 'ai-badge-high';
      case 'Medium': return 'ai-badge-med';
      case 'Low': return 'ai-badge-low';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`ai-badge ${getStyles()}`}>
      <Users size={14} /> Crowd: {level}
    </span>
  );
};
export default CrowdIndicator;
