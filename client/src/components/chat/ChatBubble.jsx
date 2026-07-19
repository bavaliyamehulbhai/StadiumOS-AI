import React from 'react';
import ReactMarkdown from 'react-markdown';
import { UserCircle, Bot } from 'lucide-react';

const ChatBubble = ({ message }) => {
  const isAI = message.role === 'ai';

  return (
    <div className={`flex w-full ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex max-w-[80%] ${isAI ? 'flex-row' : 'flex-row-reverse'} gap-3 items-end`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isAI ? (
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
              <Bot size={18} className="text-blue-600" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
              <UserCircle size={20} className="text-gray-500" />
            </div>
          )}
        </div>

        {/* Message Bubble */}
        <div 
          className={`px-4 py-3 rounded-2xl ${
            isAI 
              ? 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm' 
              : 'bg-blue-600 text-white rounded-br-none shadow-md'
          }`}
        >
          {isAI ? (
            <div className="prose prose-sm max-w-none text-gray-800">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
