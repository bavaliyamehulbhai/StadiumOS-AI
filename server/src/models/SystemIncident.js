import mongoose from 'mongoose';

const systemIncidentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['DATABASE_DOWN', 'DATABASE_LATENCY', 'HIGH_API_LATENCY', 'HIGH_ERROR_RATE', 'SOCKET_DEGRADED', 'AI_PROVIDER_DOWN', 'AI_HIGH_FAILURE_RATE']
  },
  service: {
    type: String,
    required: true,
    enum: ['MongoDB', 'REST_API', 'Socket.io', 'Groq_AI']
  },
  severity: {
    type: String,
    required: true,
    enum: ['INFO', 'WARNING', 'CRITICAL']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['OPEN', 'ACKNOWLEDGED', 'RESOLVED'],
    default: 'OPEN'
  },
  detectedAt: {
    type: Date,
    default: Date.now
  },
  acknowledgedAt: {
    type: Date
  },
  acknowledgedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  },
  metadata: {
    type: Object
  }
}, { timestamps: true });

export default mongoose.model('SystemIncident', systemIncidentSchema);
