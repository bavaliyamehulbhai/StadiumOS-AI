import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  title: { type: String, required: true },
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
  matchDate: { type: Date, required: true },
  kickoffTime: { type: String, required: true },
  endTime: { type: String },
  stage: { 
    type: String, 
    required: true,
    enum: ['Group Stage', 'Round of 16', 'Quarter Final', 'Semi Final', 'Third Place', 'Final']
  },
  status: { 
    type: String, 
    enum: ['Upcoming', 'Live', 'Completed', 'Cancelled', 'Postponed'], 
    default: 'Upcoming',
    required: true
  },
  ticketPrice: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  bookedSeats: { type: Number, required: true, default: 0 },
  availableSeats: { type: Number, required: true },
  referee: { type: String },
  weather: { type: String },
  description: { type: String },
  // Operations Fields
  operationsStartedAt: { type: Date },
  operationsEndedAt: { type: Date },
  operationsStartedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  operationsEndedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  commandMode: {
    type: String,
    enum: ['NORMAL', 'ELEVATED', 'EMERGENCY'],
    default: 'NORMAL'
  },
  currentHealthStatus: { type: Number, default: 100 },
  lastSnapshotAt: { type: Date },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Add indexes for efficient searching/filtering
matchSchema.index({ matchDate: 1 });
matchSchema.index({ stadium: 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ stage: 1 });

const Match = mongoose.model('Match', matchSchema);
export default Match;
