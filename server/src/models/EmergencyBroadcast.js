import mongoose from 'mongoose';

const emergencyBroadcastSchema = new mongoose.Schema({
  emergencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Emergency' },
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
  stadiumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium' },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['MEDICAL', 'FIRE', 'SECURITY', 'CROWD_CRUSH', 'EVACUATION', 'WEATHER', 'STRUCTURAL', 'GATE_CLOSURE', 'POWER_FAILURE', 'SUSPICIOUS_ACTIVITY', 'GENERAL'] 
  },
  severity: { 
    type: String, 
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] 
  },
  status: { 
    type: String, 
    enum: ['DRAFT', 'ACTIVE', 'UPDATED', 'RESOLVED', 'CANCELLED'], 
    default: 'DRAFT' 
  },
  source: { 
    type: String, 
    enum: ['MANUAL', 'INCIDENT', 'AI', 'SYSTEM'],
    default: 'MANUAL'
  },
  targetRoles: [{ type: String }],
  targetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  targetZones: [{ type: String }],
  instructions: {
    fan: { type: String },
    volunteer: { type: String },
    organizer: { type: String },
    admin: { type: String }
  },
  safeExitIds: [{ type: String }],
  avoidZoneIds: [{ type: String }],
  requiresAcknowledgement: { type: Boolean, default: false },
  acknowledgedBy: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    acknowledgedAt: { type: Date, default: Date.now }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  aiGenerated: { type: Boolean, default: false },
  aiMetadata: {
    confidence: Number,
    recommendations: [String],
    rationale: String
  },
  activatedAt: { type: Date },
  resolvedAt: { type: Date }
}, { timestamps: true });

// Ensure fast retrieval
emergencyBroadcastSchema.index({ status: 1 });
emergencyBroadcastSchema.index({ stadiumId: 1, status: 1 });
emergencyBroadcastSchema.index({ type: 1, severity: 1 });

const EmergencyBroadcast = mongoose.model('EmergencyBroadcast', emergencyBroadcastSchema);
export default EmergencyBroadcast;
