import React, { useState, useEffect, useRef } from 'react';
import ChatWindow from '../../components/ai/ChatWindow';
import ChatInput from '../../components/ai/ChatInput';
import SuggestedPrompts from '../../components/ai/SuggestedPrompts';
import ConversationSidebar from '../../components/ai/ConversationSidebar';
import LanguageSelector from '../../components/ai/LanguageSelector';
import AIErrorState from '../../components/ai/AIErrorState';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Assistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('English');
  const [history, setHistory] = useState([]);
  const [prompts, setPrompts] = useState([]);
  
  useEffect(() => {
    fetchHistory();
    fetchPrompts();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/assistant/history');
      if (response.data?.success) {
        setHistory(response.data.history || []);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const fetchPrompts = async () => {
    try {
      const response = await api.get('/assistant/prompts');
      if (response.data?.success) {
        setPrompts(response.data.prompts || []);
      }
    } catch (err) {
      console.error('Failed to fetch prompts', err);
    }
  };

  const handleClearHistory = async () => {
    try {
      await api.delete('/assistant/history');
      setHistory([]);
      setMessages([]);
      toast.success('Conversation history cleared');
    } catch (err) {
      toast.error('Failed to clear history');
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { text, isAI: false };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Accept-Language': language
        }
      };
      
      const response = await api.post('/assistant/chat', { 
        query: text
      }, config);
      
      if (response.data?.success) {
        setMessages(prev => [...prev, { text: response.data.reply, isAI: true }]);
        fetchHistory(); // refresh sidebar history
      } else {
        throw new Error(response.data?.message || 'Failed to get response');
      }
    } catch (err) {
      console.error('AI Chat error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred connecting to the AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] -mx-4 md:-mx-8 -my-4 md:-my-6 border rounded-xl overflow-hidden bg-background">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block w-64 border-r border-border bg-muted/20">
        <ConversationSidebar history={history} />
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-background z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-foreground">StadiumOS Copilot</h2>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
            <button 
              onClick={handleClearHistory} 
              className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 text-sm"
              title="Clear History"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Chat Content */}
        {error ? (
          <div className="flex-1 flex items-center justify-center">
             <AIErrorState message={error} onRetry={() => setError(null)} />
          </div>
        ) : (
          <ChatWindow messages={messages} isLoading={isLoading} />
        )}

        {/* Input Area */}
        <div className="p-4 bg-gradient-to-t from-background via-background to-transparent pt-6">
          <div className="max-w-3xl mx-auto space-y-3">
            {messages.length === 0 && prompts.length > 0 && (
              <SuggestedPrompts prompts={prompts} onSelect={handleSendMessage} />
            )}
            <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
