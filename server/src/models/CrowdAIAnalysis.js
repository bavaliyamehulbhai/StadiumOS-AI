import mongoose from 'mongoose';

const crowdAIAnalysisSchema = new mongoose.Schema({
  stadium: {
    type: mongoose.Schema.ObjectId,
    ref: 'Stadium',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  summary: {
    type: String,
    required: true
  },
  overallRiskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  confidence: {
    type: Number, // e.g. 92 for 92%
    default: 85
  },
  predictions: [{
    zone: String,
    currentDensity: Number,
    predictedDensity: Number,
    timeframeMinutes: Number,
    risk: String,
    reasoning: String
  }],
  recommendations: [{
    actionType: {
      type: String,
      enum: ['Redirect Crowd', 'Deploy Volunteers', 'Open Gate', 'Close Gate', 'Medical Dispatch', 'General', 'Redirect Parking']
    },
    targetZone: String,
    description: String,
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical']
    }
  }],
  rawContextUsed: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

const CrowdAIAnalysis = mongoose.model('CrowdAIAnalysis', crowdAIAnalysisSchema);

export default CrowdAIAnalysis;
