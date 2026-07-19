import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ChatInput = ({ onSend, loading }) => {
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSend} className="flex gap-2 w-full">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
        placeholder="Type your message..."
        className="flex-1 bg-white border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:opacity-50"
      />
      <Button 
        type="submit" 
        disabled={!input.trim() || loading} 
        size="icon" 
        className="h-[46px] w-[46px] rounded-full bg-blue-600 hover:bg-blue-700 shadow-md shrink-0 transition-transform active:scale-95"
      >
        <SendHorizontal size={18} className="text-white" />
      </Button>
    </form>
  );
};

export default ChatInput;
