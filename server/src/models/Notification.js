import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'EMERGENCY'],
    default: 'INFO'
  },
  category: {
    type: String,
    enum: ['AI', 'INCIDENT', 'VOLUNTEER', 'CROWD', 'PARKING', 'EMERGENCY', 'SYSTEM', 'MATCH', 'SECURITY'],
    default: 'SYSTEM'
  },
  priority: {
    type: String,
    enum: ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientRole: { type: String, enum: ['Admin', 'Organizer', 'Volunteer', 'Fan'] },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entityType: { type: String },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  actionUrl: { type: String }, // Optional hardcoded route, but entityType/entityId should be preferred
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  isPinned: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  archivedAt: { type: Date },
  source: { type: String, default: 'System' },
  metadata: { type: mongoose.Schema.Types.Mixed },
  expiresAt: { type: Date }
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, isArchived: 1 });
notificationSchema.index({ recipient: 1, category: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
