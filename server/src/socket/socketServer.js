import { Server } from 'socket.io';
import { socketAuthMiddleware } from './socketAuth.js';
import { handleConnection } from './socketManager.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // 1. Apply Authentication Middleware
  io.use(socketAuthMiddleware);

  // 2. Handle Connections
  io.on('connection', (socket) => {
    handleConnection(socket, io);
  });

  // --- TOP 400 SIMULATION COMPATIBILITY ---
  // Porting over the random incident generator so the demo still works
  setInterval(() => {
    const newCrowd = Math.floor(Math.random() * (75000 - 50000 + 1)) + 50000;
    io.to('role:Organizer').emit('crowd:updated', {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      crowd: newCrowd,
      message: `Crowd density shifted to ${newCrowd.toLocaleString()} fans.`
    });

    if (Math.random() > 0.9) {
      const issues = ["Crowd buildup at Gate 3", "Lost item near Food Court", "Medical assistance needed at Block C"];
      const randomIssue = issues[Math.floor(Math.random() * issues.length)];
      
      // Emit socket event for live feed updates (does NOT create DB notification)
      // Real notifications are created when incidents/tasks are created via API
      io.to('role:Organizer').emit('incident:created', {
        title: randomIssue,
        time: new Date().toLocaleTimeString(),
        priority: 'High'
      });
    }
  }, 15000);

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized! Call initSocket first.');
  }
  return io;
};
