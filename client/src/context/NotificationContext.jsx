import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useSocket } from '../socket/hooks/useSocket';
import { SOCKET_EVENTS } from '../socket/utils/socketEvents';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { socket } = useSocket();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await api.get('/notifications?limit=50');
      setNotifications(data.data || []);
      
      const unreadRes = await api.get('/notifications/unread-count');
      setUnreadCount(unreadRes.data.count || 0);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();

    if (socket && user) {
      const handleNewNotification = (notification) => {
        // Prevent duplicate updates in UI if same notification hits multiple rooms we're in
        setNotifications((prev) => {
          if (prev.find(n => n._id === notification._id)) return prev;
          return [notification, ...prev];
        });
        
        setUnreadCount((prev) => prev + 1);
        
        // Visual Toast
        const isCritical = notification.priority === 'CRITICAL';
        toast(
          <div className="flex flex-col gap-1">
            <p className="font-bold">{notification.title}</p>
            <p className="text-sm">{notification.message}</p>
          </div>,
          {
            icon: isCritical ? '🚨' : '🔔',
            duration: isCritical ? 6000 : 4000,
            style: {
              border: isCritical ? '2px solid #ef4444' : '1px solid #e2e8f0',
              padding: '16px',
            },
          }
        );
      };

      socket.on('notification:new', handleNewNotification);

      return () => {
        socket.off('notification:new', handleNewNotification);
      };
    }
  }, [socket, user, fetchNotifications]);

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read', error);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read', error);
    }
  };

  const togglePin = async (id) => {
    try {
      const { data } = await api.patch(`/notifications/${id}/pin`);
      if (data.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isPinned: data.data.isPinned } : n));
      }
    } catch (error) {
      console.error('Error pinning notification', error);
    }
  };

  const toggleArchive = async (id) => {
    try {
      const { data } = await api.patch(`/notifications/${id}/archive`);
      if (data.success) {
        setNotifications(prev => prev.filter(n => n._id !== id));
        toast.success(data.data.isArchived ? 'Notification archived' : 'Notification unarchived');
      }
    } catch (error) {
      console.error('Error archiving notification', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      loading, 
      markRead, 
      markAllRead,
      togglePin,
      toggleArchive,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
