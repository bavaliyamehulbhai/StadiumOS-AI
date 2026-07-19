import mongoose from 'mongoose';

const poiSchema = new mongoose.Schema({
  stadium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stadium',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Gate', 'Parking', 'FoodCourt', 'Medical', 'Washroom', 'EmergencyExit', 'Security', 'BusStop', 'MetroStation', 'Wheelchair', 'TicketCounter'],
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  floor: {
    type: String,
    default: 'Ground'
  },
  isAccessible: {
    type: Boolean,
    default: false
  },
  openingHours: {
    type: String,
    default: '24/7'
  },
  description: {
    type: String
  },
  icon: {
    type: String,
    default: '📍'
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Maintenance'],
    default: 'Open'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

poiSchema.index({ stadium: 1, type: 1 });
poiSchema.index({ name: 'text' });

const POI = mongoose.model('POI', poiSchema);
export default POI;
