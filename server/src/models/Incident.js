import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  incidentType: { 
    type: String, 
    required: true,
    enum: ['Medical', 'Fire', 'Crowd', 'Security', 'Lost Child', 'Technical', 'Transport', 'Maintenance', 'Other']
  },
  priority: { 
    type: String, 
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  status: { 
    type: String, 
    enum: ['Reported', 'Assigned', 'Accepted', 'In Progress', 'Resolved', 'Closed'],
    default: 'Reported'
  },
  location: { type: String, required: true },
  stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: { type: String },
  notes: { type: String },
  
  // Phase 3: AI & Real-time Timeline Integrations
  timeline: [{
    action: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String },
    timestamp: { type: Date, default: Date.now },
    previousStatus: { type: String },
    newStatus: { type: String },
    notes: { type: String }
  }],
  aiSummary: { type: String },
  aiSeverity: { type: String },
  aiRecommendation: [{ type: String }],
  
  resolvedAt: { type: Date },
  closedAt: { type: Date }
}, { timestamps: true });

// Indexes for faster dashboard filtering
incidentSchema.index({ stadium: 1 });
incidentSchema.index({ status: 1 });
incidentSchema.index({ priority: 1 });
incidentSchema.index({ incidentType: 1 });
incidentSchema.index({ assignedVolunteer: 1 });

const Incident = mongoose.model('Incident', incidentSchema);
export default Incident;
