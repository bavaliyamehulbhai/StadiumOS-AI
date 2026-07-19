import mongoose from 'mongoose';

const navigationHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  context: {
    role: String,
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
    },
    ticketInfo: {
      gate: String,
      seat: String,
      section: String,
    },
    crowdLevel: String,
    parking: String,
    incidents: [String],
    accessibilityMode: Boolean,
  },
  aiRecommendations: [{
    routeName: String,
    eta: String,
    crowdLevel: String,
    reason: String,
    isPrimary: Boolean,
    pathData: mongoose.Schema.Types.Mixed, // GeoJSON or waypoints
  }],
  chosenRoute: {
    type: String,
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
  },
}, { timestamps: true });

const NavigationHistory = mongoose.model('NavigationHistory', navigationHistorySchema);
export default NavigationHistory;
