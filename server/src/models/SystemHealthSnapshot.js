import mongoose from 'mongoose';

const systemHealthSnapshotSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  systemScore: {
    type: Number,
    required: true
  },
  apiLatency: {
    type: Number,
    required: true
  },
  errorRate: {
    type: Number,
    required: true
  },
  activeConnections: {
    type: Number,
    required: true
  },
  databaseLatency: {
    type: Number,
    required: true
  },
  aiLatency: {
    type: Number,
    required: true
  },
  aiFailureRate: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// TTL Index to automatically delete snapshots older than 30 days
systemHealthSnapshotSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.model('SystemHealthSnapshot', systemHealthSnapshotSchema);
