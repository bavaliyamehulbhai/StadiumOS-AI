import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['Medical', 'Fire', 'Crowd Stampede', 'Bomb Threat', 'Lost Child', 'Security Threat', 'Power Failure', 'Weather Alert', 'Earthquake', 'VIP Emergency']
  },
  severity: { 
    type: String, 
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical']
  },
  stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
  zone: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['Reported', 'Verified', 'In Progress', 'Resolved', 'Closed'],
    default: 'Reported'
  },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  evacuationRequired: { type: Boolean, default: false }
}, { timestamps: true });

// Ensure fast spatial and categorical queries
emergencySchema.index({ stadium: 1, status: 1 });
emergencySchema.index({ severity: 1 });

const Emergency = mongoose.model('Emergency', emergencySchema);
export default Emergency;
