import mongoose from 'mongoose';

const systemConfigSchema = new mongoose.Schema({
  platformName: { type: String, default: 'StadiumOS AI' },
  defaultLanguage: { type: String, default: 'en' },
  timezone: { type: String, default: 'UTC' },
  
  // Feature Toggles
  notificationEnabled: { type: Boolean, default: true },
  crowdMonitoringEnabled: { type: Boolean, default: true },
  aiEnabled: { type: Boolean, default: true },
  simulationMode: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },

  // AI & Crowd Thresholds
  aiCrowdTriggerThreshold: { type: Number, default: 80 },
  crowdWarningThreshold: { type: Number, default: 70 },
  crowdCriticalThreshold: { type: Number, default: 85 },
  aiAnalysisCooldownMs: { type: Number, default: 30000 },
  
  // Advanced AI Settings
  aiModel: { type: String, enum: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma-7b-it'], default: 'llama-3.1-8b-instant' },
  aiPersonality: { type: String, enum: ['Standard', 'Strict (Security Focus)', 'Empathetic (Fan Focus)'], default: 'Standard' },
  autoResolveIncidents: { type: Boolean, default: false },

  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
}, { timestamps: true });

const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);
export default SystemConfig;
