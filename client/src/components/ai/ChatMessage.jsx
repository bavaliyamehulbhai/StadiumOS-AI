import React from 'react';
import AIAvatar from './AIAvatar';
import MarkdownRenderer from './MarkdownRenderer';
import MessageActions from './MessageActions';
import { User } from 'lucide-react';

const ChatMessage = ({ message, isAI }) => {
  return (
    <div className={`flex w-full gap-4 ${isAI ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out`}>
      {isAI && (
        <div className="flex-shrink-0 mt-1">
          <AIAvatar size="sm" />
        </div>
      )}
      
      <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm ${
        isAI 
          ? 'bg-card border border-border text-card-foreground rounded-tl-sm' 
          : 'bg-primary text-primary-foreground rounded-tr-sm'
      }`}>
        {isAI ? (
          <div>
            <MarkdownRenderer content={message} />
            <MessageActions messageText={message} />
          </div>
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed text-sm">{message}</p>
        )}
      </div>

      {!isAI && (
        <div className="flex-shrink-0 mt-1">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
