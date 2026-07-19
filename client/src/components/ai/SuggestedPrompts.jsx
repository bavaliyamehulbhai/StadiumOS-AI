import React from 'react';
import { Sparkles } from 'lucide-react';

const SuggestedPrompts = ({ prompts, onSelect }) => {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-2 mb-4">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground ml-1">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Suggested Ask AI</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelect(prompt)}
            className="px-3 py-1.5 text-sm bg-muted hover:bg-primary hover:text-primary-foreground text-foreground border border-border rounded-full transition-all duration-200 ease-in-out shadow-sm whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPrompts;
