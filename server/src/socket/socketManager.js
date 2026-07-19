import { joinInitialRooms } from './roomManager.js';
import { SOCKET_EVENTS } from './utils/socketConstants.js';
import socketHealthService from '../monitoring/services/socketHealthService.js';

export const handleConnection = (socket, io) => {
  console.log(`[Socket] User Connected: ${socket.user.name} (${socket.user.role}) - ${socket.id}`);
  
  // Track Connection for System Health
  socketHealthService.recordConnection();

  // 1. Join Default Rooms based on Role/ID
  joinInitialRooms(socket);

  // 2. Client-triggered Room Joins (e.g. entering a specific match page)
  socket.on(SOCKET_EVENTS.JOIN_ROOM, (room) => {
    socket.join(room);
    console.log(`[Socket] ${socket.id} joined custom room: ${room}`);
  });

  socket.on(SOCKET_EVENTS.LEAVE_ROOM, (room) => {
    socket.leave(room);
    console.log(`[Socket] ${socket.id} left custom room: ${room}`);
  });

  // 3. Handle Disconnect
  socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
    console.log(`[Socket] User Disconnected: ${socket.user.name} - Reason: ${reason}`);
    
    // Track Disconnect for System Health
    socketHealthService.recordDisconnect();
  });
};
