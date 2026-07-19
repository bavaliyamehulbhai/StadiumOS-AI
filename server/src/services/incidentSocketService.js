import { getIO } from '../socket/socketServer.js';
import { SOCKET_EVENTS } from '../socket/utils/socketConstants.js';

export class IncidentSocketService {
  /**
   * Broadcast incident updates to Organizers and Admins, and the assigned Volunteer.
   */
  static broadcastIncidentUpdate(event, incident) {
    try {
      const io = getIO();
      
      // Always notify Organizers and Admins
      io.to('role:Organizer').emit(event, incident);
      io.to('role:Admin').emit(event, incident);

      // If assigned, notify the volunteer specifically
      if (incident.assignedVolunteer) {
        // Handle if populated or raw ObjectId
        const volId = incident.assignedVolunteer._id || incident.assignedVolunteer;
        io.to(`user:${volId}`).emit(event, incident);
      }
    } catch (error) {
      console.error('Socket broadcast failed for incident:', error.message);
    }
  }

  static emitCreated(incident) {
    this.broadcastIncidentUpdate(SOCKET_EVENTS.INCIDENT_CREATED, incident);
  }

  static emitUpdated(incident) {
    this.broadcastIncidentUpdate(SOCKET_EVENTS.INCIDENT_UPDATED, incident);
  }

  static emitResolved(incident) {
    this.broadcastIncidentUpdate(SOCKET_EVENTS.INCIDENT_RESOLVED, incident);
  }

  static emitClosed(incident) {
    this.broadcastIncidentUpdate(SOCKET_EVENTS.INCIDENT_CLOSED, incident);
  }

  static emitAIGenerated(incident) {
    // We can just use updated, or a specialized one
    this.broadcastIncidentUpdate(SOCKET_EVENTS.INCIDENT_UPDATED, incident);
  }
}
