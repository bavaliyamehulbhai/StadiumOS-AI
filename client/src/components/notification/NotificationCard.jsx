import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, AlertTriangle, Info, ShieldAlert, XCircle, Clock, Bot, Pin } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { resolveNotificationRoute } from '@/utils/notificationRouteResolver';
import toast from 'react-hot-toast';

const NotificationCard = ({ notification, onUpdate }) => {
  const { markRead, togglePin, toggleArchive } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getIcon = () => {
    switch (notification.type) {
      case 'EMERGENCY': return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'ERROR': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: 
        if (notification.category === 'AI') return <Bot className="w-5 h-5 text-purple-500" />;
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityStyle = () => {
    switch (notification.priority) {
      case 'CRITICAL': return 'border-l-4 border-l-red-600 bg-red-50/50';
      case 'HIGH': return 'border-l-4 border-l-orange-500';
      case 'NORMAL': return 'border-l-4 border-l-blue-400';
      default: return 'border-l-4 border-l-gray-300';
    }
  };

  const handleRead = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await markRead(notification._id);
    if (onUpdate) onUpdate();
  };

  const handleArchive = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleArchive(notification._id);
    if (onUpdate) onUpdate();
  };

  const handlePin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await togglePin(notification._id);
    if (onUpdate) onUpdate();
  };

  const handleNavigate = () => {
    if (!notification.isRead) {
      markRead(notification._id);
    }
    const targetRoute = resolveNotificationRoute(notification, user?.role);
    if (targetRoute && targetRoute !== '/') {
      navigate(targetRoute);
      if (onUpdate) onUpdate();
    }
  };

  return (
    <div 
      onClick={handleNavigate}
      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group relative ${getPriorityStyle()} ${!notification.isRead ? 'bg-blue-50/20' : 'bg-white'}`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-semibold truncate ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
              {notification.title}
            </h4>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] text-gray-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          <p className={`text-sm mt-1 line-clamp-2 ${!notification.isRead ? 'text-gray-800' : 'text-gray-500'}`}>
            {notification.message}
          </p>

          <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!notification.isRead && (
              <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={handleRead}>
                Mark Read
              </Button>
            )}
            <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={handlePin}>
              <Pin className={`w-3 h-3 mr-1 ${notification.isPinned ? 'text-blue-600 fill-blue-600' : ''}`} /> 
              {notification.isPinned ? 'Unpin' : 'Pin'}
            </Button>
            <Button size="sm" variant="ghost" className="h-6 text-[10px] text-red-600 hover:text-red-700" onClick={handleArchive}>
              Archive
            </Button>
          </div>
        </div>
      </div>
      
      {!notification.isRead && (
        <span className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></span>
      )}
    </div>
  );
};

export default NotificationCard;
