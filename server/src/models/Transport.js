import mongoose from 'mongoose';

const transportSchema = new mongoose.Schema({
  stadium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stadium',
    required: true
  },
  type: {
    type: String,
    enum: ['Metro', 'Bus', 'Taxi', 'Ride Share', 'Walking', 'Shuttle'],
    required: true
  },
  routeName: {
    type: String,
    required: true
  },
  source: String,
  destination: String,
  estimatedTime: {
    type: Number, // in minutes
    required: true
  },
  fare: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['On Time', 'Delayed', 'Suspended', 'Normal'],
    default: 'On Time'
  },
  frequency: {
    type: String, // e.g., 'Every 5 mins'
  }
}, { timestamps: true });

export const Transport = mongoose.model('Transport', transportSchema);
