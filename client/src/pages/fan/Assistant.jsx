import React from 'react';
import ChatBox from '../../components/chat/ChatBox';
import ChatHistoryPanel from '../../components/chat/ChatHistoryPanel';

const suggestedPrompts = [
  "Where is Gate A?",
  "Where is the nearest washroom?",
  "Show nearest parking.",
  "How do I reach my seat?",
  "Where is the Medical Room?"
];

const Assistant = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Stadium AI Assistant</h2>
        <p className="text-muted-foreground mt-1">Powered by Groq & Llama 3. Ask anything about navigation, food, or rules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ChatBox suggestions={suggestedPrompts} />
        </div>
        <div className="lg:col-span-1">
          <ChatHistoryPanel />
        </div>
      </div>
    </div>
  );
};

export default Assistant;
