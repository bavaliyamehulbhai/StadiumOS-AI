import mongoose from 'mongoose';

const analyticsReportSchema = new mongoose.Schema({
  reportType: { type: String, enum: ['Executive', 'Match', 'Daily'], default: 'Executive' },
  summary: { type: String, required: true },
  healthScore: { type: Number, required: true, min: 0, max: 100 },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  predictions: [{
    category: { type: String }, // e.g., 'Crowd', 'Parking'
    issue: { type: String },
    timeframe: { type: String },
    impact: { type: String }
  }],
  recommendations: [{
    action: { type: String },
    reason: { type: String },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'] }
  }],
  kpis: {
    attendance: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    activeIncidents: { type: Number, default: 0 },
    parkingUtilization: { type: Number, default: 0 },
    availableVolunteers: { type: Number, default: 0 }
  },
  aiModel: { type: String, default: process.env.AI_MODEL || 'llama-3.1-8b-instant' },
  generatedAt: { type: Date, default: Date.now, expires: 86400 } // Auto-delete after 24h
}, { timestamps: true });

export default mongoose.model('AIAnalyticsReport', analyticsReportSchema);
