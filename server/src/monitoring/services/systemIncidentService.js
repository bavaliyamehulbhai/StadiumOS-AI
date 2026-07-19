import SystemIncident from '../../models/SystemIncident.js';
import NotificationService from '../../services/notificationService.js';
import { getIO } from '../../socket/socketServer.js';

class SystemIncidentService {
  async detectAndCreateIncident(service, type, severity, title, description) {
    try {
      // Deduplication: Check if there's already an OPEN incident of this type for this service
      const existing = await SystemIncident.findOne({ service, type, status: 'OPEN' });
      
      if (existing) {
        // Just update metadata/timestamp
        existing.updatedAt = new Date();
        await existing.save();
        return existing;
      }

      // Create new incident
      const incident = await SystemIncident.create({
        service,
        type,
        severity,
        title,
        description
      });

      // Send alert
      await this.notifyAdmins(incident, 'New System Alert');
      
      this.emitSocketEvent('system.incident.created', incident);
      return incident;
    } catch (error) {
      console.error('[SystemIncidentService] Error creating incident:', error);
    }
  }

  async resolveIncidentByType(service, type) {
    try {
      const incidents = await SystemIncident.find({ service, type, status: { $ne: 'RESOLVED' } });
      
      for (const inc of incidents) {
        inc.status = 'RESOLVED';
        inc.resolvedAt = new Date();
        await inc.save();
        
        await this.notifyAdmins(inc, 'System Alert Resolved');
        this.emitSocketEvent('system.incident.resolved', inc);
      }
    } catch (error) {
      console.error('[SystemIncidentService] Error resolving incident:', error);
    }
  }

  async getActiveIncidents() {
    return SystemIncident.find({ status: { $ne: 'RESOLVED' } }).sort({ detectedAt: -1 }).lean();
  }

  async notifyAdmins(incident, prefix) {
    try {
      // Ideally fetch all users with role 'Admin'
      // For this demo, we can just broadcast or use NotificationService if we have admin emails/ids
      // Assuming NotificationService has a way to notify roles or we manually fetch admins
      // But we can just use socket to role:Admin
      this.emitSocketEvent('notification', {
        title: `${prefix}: ${incident.title}`,
        message: incident.description,
        type: incident.status === 'RESOLVED' ? 'SUCCESS' : (incident.severity === 'CRITICAL' ? 'CRITICAL' : 'WARNING'),
        category: 'SYSTEM_ALERT'
      });
    } catch (error) {
      console.error('[SystemIncidentService] Notification failed:', error);
    }
  }

  emitSocketEvent(event, data) {
    try {
      getIO().to('role:Admin').emit(event, data);
    } catch (e) {
      // socket not ready
    }
  }
}

export default new SystemIncidentService();
