import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

const ChatWindow = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to StadiumOS Copilot</h3>
        <p className="max-w-md">
          I'm here to help you navigate the stadium, find facilities, and answer any questions about the match.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} message={msg.text} isAI={msg.isAI} />
      ))}
      
      {isLoading && (
        <TypingIndicator />
      )}
      
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatWindow;
