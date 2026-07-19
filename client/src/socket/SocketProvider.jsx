import React, { createContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import { SOCKET_EVENTS } from './utils/socketEvents';
import toast from 'react-hot-toast';

export const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Only connect if user is authenticated
    if (user && !socketRef.current) {
      // Create socket instance
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      // Connection Lifecycle Listeners
      newSocket.on(SOCKET_EVENTS.CONNECT, () => {
        console.log(`[Socket] Connected: ${newSocket.id}`);
        setIsConnected(true);
        setIsReconnecting(false);
      });

      newSocket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
        console.warn(`[Socket] Disconnected: ${reason}`);
        setIsConnected(false);
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, you need to reconnect manually
          newSocket.connect();
        }
      });

      newSocket.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
        console.error(`[Socket] Connection Error: ${error.message}`);
        setIsReconnecting(true);
        setIsConnected(false);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    }

    // Cleanup on unmount or logout
    return () => {
      if (!user && socketRef.current) {
        console.log('[Socket] Disconnecting due to logout');
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [user]);

  // Clean up entirely on component unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, isReconnecting }}>
      {children}
    </SocketContext.Provider>
  );
};
