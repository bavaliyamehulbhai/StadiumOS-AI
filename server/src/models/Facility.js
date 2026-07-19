import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema({
  stadium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stadium',
    required: true
  },
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Elevator', 'Ramp', 'Accessible Washroom', 'Wheelchair Parking', 'Medical Room', 'Help Desk', 'Accessible Entrance'],
    required: true 
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  accessible: { type: Boolean, default: true },
  brailleSupport: { type: Boolean, default: false },
  audioSupport: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['Active', 'Under Maintenance', 'Closed'],
    default: 'Active'
  }
}, { timestamps: true });

export default mongoose.model('Facility', facilitySchema);
