import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Clock, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ChatHistoryPanel = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/chat');
      if (data.success) {
        setHistory(data.history);
      }
    } catch (error) {
      toast.error('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (id) => {
    try {
      await api.delete(`/chat/${id}`);
      setHistory(prev => prev.filter(chat => chat._id !== id));
      toast.success('Chat deleted');
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border shadow-sm flex flex-col h-[600px] overflow-hidden">
      <div className="px-4 py-3 border-b bg-gray-50 flex items-center gap-2">
        <Clock size={16} className="text-gray-500" />
        <h3 className="font-semibold text-sm text-gray-700">Recent Chats</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
            <MessageSquare size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No recent conversations. Start chatting with the AI!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {history.map((chat) => (
              <div key={chat._id} className="group p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors cursor-pointer flex justify-between items-start gap-3">
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-gray-800 truncate">{chat.question}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">{chat.answer}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteChat(chat._id); }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryPanel;
