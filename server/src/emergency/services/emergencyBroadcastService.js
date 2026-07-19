import EmergencyBroadcast from '../../models/EmergencyBroadcast.js';
import NotificationService from '../../services/notificationService.js';
import { getIO } from '../../socket/socketServer.js';
import { auditService } from '../../audit/services/auditService.js';
import EmergencyTargetService from './emergencyTargetService.js';

class EmergencyBroadcastService {
  /**
   * Create a new emergency broadcast draft
   */
  static async createDraft(data, userId) {
    const broadcast = await EmergencyBroadcast.create({
      ...data,
      status: 'DRAFT',
      createdBy: userId
    });
    
    await auditService.logEvent({
      user: userId,
      action: 'CREATE_EMERGENCY_DRAFT',
      module: 'Emergency',
      targetId: broadcast._id,
      metadata: { title: broadcast.title, type: broadcast.type, severity: broadcast.severity }
    });
    
    return broadcast;
  }

  /**
   * Activate an emergency broadcast
   */
  static async activateBroadcast(id, userId) {
    const broadcast = await EmergencyBroadcast.findById(id);
    if (!broadcast) throw new Error('Broadcast not found');
    if (broadcast.status === 'ACTIVE') throw new Error('Broadcast is already active');

    broadcast.status = 'ACTIVE';
    broadcast.activatedAt = new Date();
    await broadcast.save();

    // 1. Resolve Target Users (For DB Notifications)
    let targetUsers = await EmergencyTargetService.resolveTargets(broadcast.targetRoles, broadcast.targetZones);

    // 2. Dispatch Notifications via NotificationService
    const io = getIO();
    for (const user of targetUsers) {
      // Get role-specific instruction if it exists
      const roleStr = user.role.toLowerCase();
      let instruction = broadcast.instructions?.[roleStr] || broadcast.message;

      // Create Notification
      await NotificationService.sendNotification({
        recipient: user._id,
        title: `🚨 ${broadcast.title}`,
        message: instruction,
        type: 'EMERGENCY',
        category: 'EMERGENCY',
        priority: broadcast.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        entityId: broadcast._id,
        entityType: 'EmergencyBroadcast'
      });
    }

    // 3. Emit Socket Broadcasts for Real-Time UI updates
    if (broadcast.targetRoles && broadcast.targetRoles.length > 0) {
      broadcast.targetRoles.forEach(role => {
        io.to(`role:${role}`).emit('emergency.broadcast.active', broadcast);
      });
    } else {
      // Fallback: emit globally if no roles specified
      io.emit('emergency.broadcast.active', broadcast);
    }

    // 4. Audit Log
    await auditService.logEvent({
      user: userId,
      action: 'ACTIVATE_EMERGENCY',
      module: 'Emergency',
      targetId: broadcast._id,
      metadata: { title: broadcast.title, severity: broadcast.severity, roles: broadcast.targetRoles }
    });

    return broadcast;
  }

  /**
   * Resolve an active emergency
   */
  static async resolveBroadcast(id, userId) {
    const broadcast = await EmergencyBroadcast.findById(id);
    if (!broadcast) throw new Error('Broadcast not found');

    broadcast.status = 'RESOLVED';
    broadcast.resolvedAt = new Date();
    await broadcast.save();

    // Broadcast Resolution
    const io = getIO();
    if (broadcast.targetRoles && broadcast.targetRoles.length > 0) {
      broadcast.targetRoles.forEach(role => {
        io.to(`role:${role}`).emit('emergency.broadcast.resolved', { id: broadcast._id, title: broadcast.title });
      });
    } else {
      io.emit('emergency.broadcast.resolved', { id: broadcast._id, title: broadcast.title });
    }

    // Audit Log
    await auditService.logEvent({
      user: userId,
      action: 'RESOLVE_EMERGENCY',
      module: 'Emergency',
      targetId: broadcast._id,
      metadata: { title: broadcast.title }
    });

    return broadcast;
  }
}

export default EmergencyBroadcastService;
