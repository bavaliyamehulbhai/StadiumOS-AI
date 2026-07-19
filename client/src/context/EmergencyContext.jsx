import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { useSocket } from '../socket/hooks/useSocket';
import { SOCKET_EVENTS } from '../socket/utils/socketEvents';

const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [activeBroadcasts, setActiveBroadcasts] = useState([]);
  const [isCrisisMode, setIsCrisisMode] = useState(false);
  const [crisisData, setCrisisData] = useState(null);

  const fetchActiveBroadcasts = useCallback(async () => {
    try {
      const res = await api.get('/emergency-broadcasts/active');
      const broadcasts = res.data.data;
      setActiveBroadcasts(broadcasts);

      // A crisis is any broadcast with HIGH or CRITICAL severity
      const critical = broadcasts.find(b => b.severity === 'CRITICAL' || b.severity === 'HIGH');
      
      if (critical) {
        setIsCrisisMode(true);
        setCrisisData(critical);
      } else {
        setIsCrisisMode(false);
        setCrisisData(null);
      }
    } catch (error) {
      console.error('Failed to fetch emergency broadcasts', error);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchActiveBroadcasts();
  }, [user, fetchActiveBroadcasts]);

  useEffect(() => {
    if (!socket) return;

    const handleBroadcastActive = (broadcast) => {
      setActiveBroadcasts(prev => {
        const exists = prev.find(b => b._id === broadcast._id);
        if (exists) return prev.map(b => b._id === broadcast._id ? broadcast : b);
        return [broadcast, ...prev];
      });

      if (broadcast.severity === 'CRITICAL' || broadcast.severity === 'HIGH') {
        setIsCrisisMode(true);
        setCrisisData(broadcast);
      }
    };

    const handleBroadcastResolved = (data) => {
      setActiveBroadcasts(prev => prev.filter(b => b._id !== data.id));
      
      // Re-evaluate if there's any other critical active
      fetchActiveBroadcasts();
    };

    socket.on(SOCKET_EVENTS.EMERGENCY_BROADCAST_ACTIVE, handleBroadcastActive);
    socket.on(SOCKET_EVENTS.EMERGENCY_BROADCAST_RESOLVED, handleBroadcastResolved);

    return () => {
      socket.off(SOCKET_EVENTS.EMERGENCY_BROADCAST_ACTIVE, handleBroadcastActive);
      socket.off(SOCKET_EVENTS.EMERGENCY_BROADCAST_RESOLVED, handleBroadcastResolved);
    };
  }, [socket, fetchActiveBroadcasts]);

  // Expose manual trigger for demo purposes
  const simulateCrisis = async () => {
    try {
      await api.post('/emergency/simulate');
      toast.success('Simulation triggered.');
    } catch (error) {
      toast.error('Simulation failed.');
    }
  };

  const acknowledgeBroadcast = async (id) => {
    try {
      await api.post(`/emergency-broadcasts/${id}/acknowledge`);
    } catch (error) {
      console.error('Failed to acknowledge', error);
    }
  };

  return (
    <EmergencyContext.Provider value={{ 
      activeBroadcasts, 
      isCrisisMode, 
      crisisData, 
      fetchActiveBroadcasts, 
      simulateCrisis,
      acknowledgeBroadcast
    }}>
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => useContext(EmergencyContext);
