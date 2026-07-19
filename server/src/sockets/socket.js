import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join role-specific room (e.g., 'Admin', 'Organizer', 'Volunteer')
    socket.on('join-room', (role) => {
      socket.join(role);
      console.log(`Socket ${socket.id} joined room: ${role}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // --- THE TOP 400 SIMULATION ENGINE ---
  // This interval runs every 15 seconds to simulate a live match environment
  setInterval(() => {
    // 1. Simulate Crowd Density Shift
    const newCrowd = Math.floor(Math.random() * (75000 - 50000 + 1)) + 50000;
    io.to('Organizer').emit('crowd:update', {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      crowd: newCrowd,
      message: `Crowd density shifted to ${newCrowd.toLocaleString()} fans.`
    });

    // 2. Simulate Random Incident (10% chance every 15 seconds)
    if (Math.random() > 0.9) {
      const issues = ["Crowd buildup at Gate 3", "Lost item near Food Court", "Medical assistance needed at Block C"];
      const randomIssue = issues[Math.floor(Math.random() * issues.length)];
      
      io.to('Organizer').emit('incident:create', {
        title: randomIssue,
        time: new Date().toLocaleTimeString(),
        priority: 'High'
      });

      io.to('Organizer').emit('notification:new', {
        message: `New Incident: ${randomIssue}`,
        type: 'Warning'
      });
    }
  }, 15000);

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
