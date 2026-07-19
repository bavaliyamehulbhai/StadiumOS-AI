import mongoose from 'mongoose';

const emergencyRuleSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Medical', 'Fire', 'Security', 'Crowd Crush', 'Evacuation', 'Weather'],
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  actions: {
    notifyOrganizer: { type: Boolean, default: true },
    dispatchVolunteer: { type: Boolean, default: true },
    triggerAI: { type: Boolean, default: true },
    showMapAlert: { type: Boolean, default: true }
  },
  description: { type: String }
}, { timestamps: true });

const EmergencyRule = mongoose.model('EmergencyRule', emergencyRuleSchema);
export default EmergencyRule;
