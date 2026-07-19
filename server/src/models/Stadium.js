import mongoose from 'mongoose';

const stadiumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  address: { type: String, required: true },
  capacity: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Active', 'Maintenance', 'Closed'],
    default: 'Active',
    required: true
  },
  parkingCapacity: { type: Number, required: true },
  gates: { type: Number, required: true },
  foodCourts: { type: Number, required: true },
  medicalRooms: { type: Number, required: true },
  emergencyExits: { type: Number, required: true },
  wheelchairAccess: { type: Boolean, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  zoom: { type: Number, default: 16 },
  image: { type: String },
  description: { type: String },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Add compound indexes for optimized searching and filtering
stadiumSchema.index({ name: 'text', city: 'text' });
stadiumSchema.index({ status: 1 });
stadiumSchema.index({ isDeleted: 1 });

const Stadium = mongoose.model('Stadium', stadiumSchema);
export default Stadium;
