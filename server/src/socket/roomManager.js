export const joinInitialRooms = (socket) => {
  const { user } = socket;

  if (!user) return;

  // 1. Join Personal Room (for direct notifications)
  const userRoom = `user:${user._id}`;
  socket.join(userRoom);
  console.log(`Socket ${socket.id} joined ${userRoom}`);

  // 2. Join Role Room (for role-wide broadcasts)
  if (user.role) {
    const roleRoom = `role:${user.role}`;
    socket.join(roleRoom);
    console.log(`Socket ${socket.id} joined ${roleRoom}`);
  }

  // 3. Join Stadium Room (if associated with one)
  // Usually, Fans might not have a static stadium, but Organizers/Admins might
  // Or we can join them to a global stadium room if they are active there.
  // For now, if the user document has a stadium field, join it.
  if (user.stadium) {
    const stadiumRoom = `stadium:${user.stadium}`;
    socket.join(stadiumRoom);
    console.log(`Socket ${socket.id} joined ${stadiumRoom}`);
  }
};

export const leaveAllRooms = (socket) => {
  // Socket.io automatically handles leaving rooms on disconnect, 
  // but if we need manual cleanup during an active connection, we do it here.
  socket.rooms.forEach(room => {
    if (room !== socket.id) {
      socket.leave(room);
    }
  });
};
