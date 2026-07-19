import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/context/NotificationContext';
import NotificationCard from './NotificationCard';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle2 } from 'lucide-react';

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  
  if (!isOpen) return null;

  const displayNotifications = notifications.slice(0, 5); // Show only top 5 in dropdown

  return (
    <>
      {/* Invisible overlay to close panel when clicking outside */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="h-8 text-xs text-gray-500 hover:text-blue-600">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {displayNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
              <Bell className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            displayNotifications.map((notif, idx) => (
              <NotificationCard 
                key={notif._id || notif.id || idx} 
                notification={notif} 
                onUpdate={onClose} 
              />
            ))
          )}
        </div>

        <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
          <Link 
            to="/notifications" 
            onClick={onClose}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            View all notifications
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
