import React from 'react';
import AIAvatar from './AIAvatar';

const TypingIndicator = () => {
  return (
    <div className="flex w-full gap-4 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out">
      <div className="flex-shrink-0 mt-1">
        <AIAvatar size="md" />
      </div>
      <div className="max-w-[80%] rounded-2xl px-5 py-4 shadow-sm bg-card border border-border rounded-tl-sm flex items-center space-x-1.5">
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default TypingIndicator;
