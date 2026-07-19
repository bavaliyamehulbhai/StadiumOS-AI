import AuditLog from '../../models/AuditLog.js';
import { getIO } from '../../socket/socketServer.js';

class AuditService {
  /**
   * Log an event to the Audit Database and broadcast it
   * @param {Object} logData - Data for the audit log
   */
  async logEvent(logData) {
    try {
      // 1. Save to immutable database
      const auditEntry = await AuditLog.create(logData);

      // 2. Broadcast immediately for the live timeline
      const io = getIO();
      if (io) {
        // Populate user for the UI
        const populatedEntry = await AuditLog.findById(auditEntry._id).populate('user', 'name role email');
        io.emit('audit:created', populatedEntry);
      }

      return auditEntry;
    } catch (error) {
      console.error('[AuditService] Failed to log event:', error);
      // Fail silently to not disrupt the main business flow
    }
  }

  /**
   * Log an automated AI Decision
   */
  async logAIDecision(module, action, severity, metadata) {
    return this.logEvent({
      module,
      action,
      severity,
      aiGenerated: true,
      metadata
    });
  }
}

export const auditService = new AuditService();
