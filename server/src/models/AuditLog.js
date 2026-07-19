import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  module: {
    type: String,
    required: true,
    enum: ['Authentication', 'Incident', 'Volunteer', 'Crowd', 'AI Engine', 'Dashboard', 'Emergency', 'Parking', 'Notification', 'Admin', 'General', 'Map', 'Executive Reports', 'System Health']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  role: {
    type: String
  },
  entityId: {
    type: mongoose.Schema.ObjectId
  },
  entityType: {
    type: String
  },
  oldValue: {
    type: mongoose.Schema.Types.Mixed
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed
  },
  severity: {
    type: String,
    enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'CRITICAL'],
    default: 'INFO'
  },
  status: {
    type: String
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  location: {
    type: String
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true // Prevent modification of historical entries
  }
});

// Indexes for fast filtering
auditLogSchema.index({ module: 1, createdAt: -1 });
auditLogSchema.index({ severity: 1, createdAt: -1 });
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ aiGenerated: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
