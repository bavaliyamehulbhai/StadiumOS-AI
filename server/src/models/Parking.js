import mongoose from 'mongoose';

const parkingSchema = new mongoose.Schema({
  stadium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stadium',
    required: true
  },
  zone: {
    type: String, // e.g., 'P1', 'P2', 'VIP'
    required: true
  },
  type: {
    type: String,
    enum: ['General', 'VIP', 'Accessible', 'Staff', 'Media'],
    default: 'General'
  },
  capacity: {
    type: Number,
    required: true
  },
  occupied: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Open', 'Almost Full', 'Full', 'Closed'],
    default: 'Open'
  },
  walkingDistance: {
    type: Number, // Time in minutes to walk to stadium
    required: true
  },
  latitude: Number,
  longitude: Number,
  price: {
    type: Number,
    default: 0 // Mock price
  }
}, { timestamps: true });

// Virtual for available spots
parkingSchema.virtual('available').get(function() {
  return this.capacity - this.occupied;
});

parkingSchema.set('toJSON', { virtuals: true });
parkingSchema.set('toObject', { virtuals: true });

// Add reservation schema within the same file for simplicity, or as a subdocument
const parkingReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parkingZone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Reserved', 'Checked-In', 'Cancelled', 'Expired'],
    default: 'Reserved'
  },
  reservationTime: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const Parking = mongoose.model('Parking', parkingSchema);
export const ParkingReservation = mongoose.model('ParkingReservation', parkingReservationSchema);
