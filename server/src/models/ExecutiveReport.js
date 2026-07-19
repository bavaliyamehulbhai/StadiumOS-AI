import mongoose from 'mongoose';

const executiveReportSchema = new mongoose.Schema({
  reportId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `REP-${new Date().getTime().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
  },
  type: { 
    type: String, 
    enum: ['MATCH_EXECUTIVE', 'DAILY_OPERATIONS', 'INCIDENT_ANALYSIS', 'EMERGENCY_RESPONSE', 'CROWD_INTELLIGENCE', 'VOLUNTEER_PERFORMANCE', 'AI_DECISION_ANALYSIS', 'CUSTOM'],
    required: true
  },
  title: { type: String, required: true },
  stadiumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium' },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  status: {
    type: String,
    enum: ['PENDING', 'COLLECTING_DATA', 'GENERATING_AI', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Deterministic numerical snapshot ensuring reports are immutable
  metricsSnapshot: { type: mongoose.Schema.Types.Mixed, default: {} },
  
  // Health Score calculation (0-100)
  healthScore: { type: Number },
  
  // AI Generated Sections (Structured JSON)
  aiAnalysis: {
    executiveSummary: { type: String },
    operationalAssessment: { type: String },
    crowdAnalysis: { type: String },
    incidentAnalysis: { type: String },
    volunteerAnalysis: { type: String },
    emergencyAnalysis: { type: String },
    aiDecisionAnalysis: { type: String }
  },
  
  keyRisks: [{ type: String }],
  keySuccesses: [{ type: String }],
  recommendations: [{
    category: { type: String, enum: ['Immediate', 'Next Match', 'Long-Term'] },
    text: { type: String }
  }],
  
  aiMetadata: {
    model: { type: String },
    generatedAt: { type: Date },
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
    errorReason: { type: String }
  }

}, { timestamps: true });

const ExecutiveReport = mongoose.model('ExecutiveReport', executiveReportSchema);

export default ExecutiveReport;
