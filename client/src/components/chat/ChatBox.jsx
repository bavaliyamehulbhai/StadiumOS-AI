import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { Loader2, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const ChatBox = ({ suggestions }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! I am StadiumOS AI powered by Groq. How can I assist you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const scrollRef = useRef(null);

  const languages = ['English', 'Hindi', 'Gujarati', 'Spanish', 'French'];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (text) => {
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Sending language preference for Multilingual Support!
      const { data } = await api.post('/ai/chat', { message: text, language });
      
      if (data.success) {
        setMessages((prev) => [...prev, { role: 'ai', content: data.reply }]);
      }
    } catch (error) {
      toast.error('AI Service is temporarily unavailable.');
      setMessages((prev) => [...prev, { role: 'ai', content: 'Sorry, I am having trouble connecting to the AI brain right now. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] w-full bg-gray-50/50 rounded-2xl border overflow-hidden shadow-sm">
      
      {/* Header with AI Status Badge & Multilingual Toggle */}
      <div className="bg-white px-4 py-3 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </div>
          <span className="text-sm font-semibold text-gray-700">AI Online</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-gray-400" />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-blue-500"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        {messages.map((msg, idx) => (
          <ChatBubble key={idx} message={msg} />
        ))}
        
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="flex gap-2 items-center bg-white border px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
              <Loader2 size={16} className="animate-spin text-blue-600" />
              <span className="text-sm text-gray-500 font-medium">Llama 3 is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions & Input Area */}
      <div className="p-4 bg-white border-t">
        {suggestions && messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(suggestion)}
                className="text-xs bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-200 rounded-full px-3 py-1.5 transition-colors font-medium"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        <ChatInput onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
};

export default ChatBox;
