import mongoose from 'mongoose';

const incidentAIAnalysisSchema = new mongoose.Schema({
  incident: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Incident', 
    required: true,
    unique: true 
  },
  summary: { 
    type: String, 
    required: true 
  },
  severity: { 
    type: String, 
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  confidence: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  recommendedActions: [{
    type: String
  }],
  requiredResources: [{
    type: String
  }],
  estimatedResolution: { 
    type: String // e.g., "10-15 minutes"
  },
  riskLevel: { 
    type: String, 
    enum: ['Safe', 'Warning', 'Danger', 'Critical']
  },
  reasoning: {
    type: String
  },
  aiModel: { 
    type: String,
    default: 'llama-3.1-8b-instant'
  }
}, { timestamps: true });

const IncidentAIAnalysis = mongoose.model('IncidentAIAnalysis', incidentAIAnalysisSchema);
export default IncidentAIAnalysis;
