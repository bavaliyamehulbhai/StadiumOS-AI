import React from 'react';
import { Bot } from 'lucide-react';
import './NavigationAI.css';

const FloatingAIButton = ({ onClick }) => {
  return (
    <button className="ai-floating-btn" onClick={onClick}>
      <Bot className="ai-floating-btn-icon" size={24} />
      <span>Navigate</span>
    </button>
  );
};

export default FloatingAIButton;
