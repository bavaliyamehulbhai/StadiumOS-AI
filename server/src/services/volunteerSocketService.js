import { getIO } from '../socket/socketServer.js';
import { SOCKET_EVENTS } from '../socket/utils/socketConstants.js';

export const VolunteerSocketService = {
  // Task Lifecycle Events
  emitTaskAssigned: (task) => {
    const io = getIO();
    // Notify the specific volunteer who got assigned
    if (task.assignedVolunteer) {
      io.to(`user:${task.assignedVolunteer._id || task.assignedVolunteer}`).emit('task:assigned', task);
    }
    // Notify all organizers
    io.to('role:Organizer').to('role:Admin').emit('task:assigned', task);
  },

  emitTaskUpdated: (task) => {
    const io = getIO();
    if (task.assignedVolunteer) {
      io.to(`user:${task.assignedVolunteer._id || task.assignedVolunteer}`).emit('task:updated', task);
    }
    io.to('role:Organizer').to('role:Admin').emit('task:updated', task);
  },

  emitTaskAIGenerated: (task) => {
    const io = getIO();
    if (task.assignedVolunteer) {
      io.to(`user:${task.assignedVolunteer._id || task.assignedVolunteer}`).emit('task:ai:generated', task);
    }
    io.to('role:Organizer').to('role:Admin').emit('task:ai:generated', task);
  },

  // Volunteer Status Events
  emitVolunteerStatusUpdated: (volunteerId, newAvailability) => {
    const io = getIO();
    // Broadcast to Organizers/Admins that a volunteer changed status
    io.to('role:Organizer').to('role:Admin').emit('volunteer:status:updated', {
      volunteerId,
      availability: newAvailability
    });
  }
};
