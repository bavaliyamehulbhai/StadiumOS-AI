import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';

const ConversationSidebar = ({ history, onSelect }) => {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
        <Clock className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">No recent conversations</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <h3 className="px-4 py-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Recent Activity
      </h3>
      <div className="flex-1 px-2 space-y-1">
        {history.map((conv, idx) => (
          <button
            key={idx}
            onClick={() => onSelect && onSelect(conv)}
            className="w-full flex items-start gap-3 px-3 py-2 text-left text-sm rounded-md hover:bg-muted transition-colors group"
          >
            <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground group-hover:text-primary shrink-0" />
            <div className="flex-1 truncate">
              <span className="text-foreground truncate block">
                {conv.message}
              </span>
              <span className="text-xs text-muted-foreground truncate block">
                {new Date(conv.createdAt).toLocaleDateString()}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationSidebar;
