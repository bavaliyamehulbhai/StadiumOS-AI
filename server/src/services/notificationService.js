import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { getIO } from '../socket/socketServer.js';

class NotificationService {
  /**
   * Internal function to create and emit a notification
   */
  static async sendNotification(data) {
    try {
      // 0. Normalize enums to match new schema (supports legacy mixed-case callers)
      const priorityMap = { low: 'LOW', normal: 'NORMAL', medium: 'NORMAL', high: 'HIGH', critical: 'CRITICAL' };
      const typeMap = { info: 'INFO', success: 'SUCCESS', warning: 'WARNING', error: 'ERROR', emergency: 'EMERGENCY' };
      if (data.priority) data.priority = priorityMap[data.priority.toLowerCase()] || data.priority.toUpperCase();
      if (data.type) data.type = typeMap[data.type.toLowerCase()] || data.type.toUpperCase();

      // 1. Deduplication Logic (Cooldown 5 minutes)
      // If priority is not CRITICAL, and it has an entityId and category, check recent
      if (data.priority !== 'CRITICAL' && data.entityId && data.category) {
        const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recentNotification = await Notification.findOne({
          category: data.category,
          entityId: data.entityId,
          createdAt: { $gte: fiveMinsAgo },
          ...(data.recipient && { recipient: data.recipient }),
          ...(data.recipientRole && { recipientRole: data.recipientRole })
        });

        if (recentNotification) {
          console.log(`[NotificationService] Deduplicated notification for ${data.category} - ${data.entityId}`);
          return recentNotification; // Skip creation
        }
      }

      // 2. Resolve Targets
      // If we only have recipientRole, we might want to get all users of that role to create individual DB records.
      // But for hackathon scope, we can create one generic DB record (if it's broadcast) or individual records.
      // The prompt suggests we create notifications per user for accurate Read states.
      
      let targetUsers = [];
      if (data.recipient) {
        targetUsers.push(data.recipient);
      } else if (data.recipientRole) {
        // Fetch all active users with this role
        const users = await User.find({ role: data.recipientRole, status: 'Active' }).select('_id');
        targetUsers = users.map(u => u._id);
      } else {
        console.warn('[NotificationService] No recipient or recipientRole provided. Skipping DB creation.');
        return null;
      }

      const notifications = [];
      for (const userId of targetUsers) {
        const payload = { ...data, recipient: userId };
        const notification = await Notification.create(payload);
        notifications.push(notification);
        
        // 3. Emit to individual socket rooms
        try {
          const io = getIO();
          io.to(`user:${userId}`).emit('notification:new', notification);
        } catch (err) {
          console.error(`Socket error for user ${userId}:`, err.message);
        }
      }

      return notifications.length === 1 ? notifications[0] : notifications;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  static async sendTaskNotification(receiverId, title, message, actionUrl, priority = 'NORMAL', senderId = null, relatedTaskId = null) {
    return this.sendNotification({
      recipient: receiverId,
      sender: senderId,
      title,
      message,
      type: 'INFO',
      category: 'VOLUNTEER',
      priority,
      actionUrl,
      entityId: relatedTaskId,
      entityType: 'Task'
    });
  }

  static async sendIncidentNotification(receiverId, title, message, actionUrl, priority = 'HIGH', senderId = null, relatedIncidentId = null) {
    return this.sendNotification({
      recipient: receiverId,
      sender: senderId,
      title,
      message,
      type: 'WARNING',
      category: 'INCIDENT',
      priority,
      actionUrl,
      entityId: relatedIncidentId,
      entityType: 'Incident'
    });
  }

  static async sendEmergencyNotification(receiverId, title, message, actionUrl = null, senderId = null) {
    // If receiverId is a role name, pass it to recipientRole
    const payload = {
      sender: senderId,
      title,
      message,
      type: 'EMERGENCY',
      category: 'EMERGENCY',
      priority: 'CRITICAL',
      actionUrl
    };

    if (mongoose.Types.ObjectId.isValid(receiverId)) {
      payload.recipient = receiverId;
    } else {
      payload.recipientRole = receiverId; // e.g. "Fan", "Volunteer"
    }

    return this.sendNotification(payload);
  }

  static async sendMatchNotification(receiverId, title, message, actionUrl = null) {
    return this.sendNotification({
      recipient: receiverId,
      title,
      message,
      type: 'INFO',
      category: 'MATCH',
      priority: 'HIGH',
      actionUrl
    });
  }

  static async sendAnnouncement(receiverId, title, message, actionUrl = null) {
    return this.sendNotification({
      recipient: receiverId,
      title,
      message,
      type: 'INFO',
      category: 'SYSTEM',
      priority: 'NORMAL',
      actionUrl
    });
  }
}

export default NotificationService;
