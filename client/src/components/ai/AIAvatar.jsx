import React from 'react';
import { Bot } from 'lucide-react';

const AIAvatar = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  return (
    <div className={`flex items-center justify-center rounded-full bg-primary/10 text-primary ${sizeClasses[size]} ${className}`}>
      <Bot className="w-3/5 h-3/5" />
    </div>
  );
};

export default AIAvatar;
