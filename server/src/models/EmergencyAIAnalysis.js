import mongoose from 'mongoose';

const emergencyAIAnalysisSchema = new mongoose.Schema({
  emergency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emergency',
    required: true,
    unique: true // One AI analysis per emergency (upsert pattern)
  },
  // Mirror key emergency fields for quick access
  emergencyType: { type: String },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
  affectedZone: { type: String },
  // AI-generated content
  summary: { type: String, required: true },
  overallRisk: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  confidence: { type: Number, default: 80 }, // 0-100
  safeExits: [{
    exit: String,
    walkingTimeMinutes: Number,
    crowdLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
    reason: String
  }],
  resources: [{
    team: String,
    count: Number,
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] },
    reason: String
  }],
  evacuationSteps: [{ type: String }],
  medicalGuidance: { type: String },
  immediateActions: [{ type: String }],
  estimatedResolutionMinutes: { type: Number, default: 15 },
  warnings: [{ type: String }],
  aiModel: { type: String, default: process.env.AI_MODEL || 'llama-3.1-8b-instant' },
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const EmergencyAIAnalysis = mongoose.model('EmergencyAIAnalysis', emergencyAIAnalysisSchema);
export default EmergencyAIAnalysis;
