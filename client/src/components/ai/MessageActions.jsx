import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const MessageActions = ({ messageText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-end mt-2">
      <button 
        onClick={handleCopy}
        className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        title="Copy response"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
};

export default MessageActions;
