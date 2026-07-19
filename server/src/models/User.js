import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  role: { 
    type: String, 
    enum: ['Admin', 'Organizer', 'Volunteer', 'Fan'],
    default: 'Fan'
  },
  phone: { type: String, default: '' },
  language: { type: String, default: 'en' },
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  
  // Phase 4: Volunteer Specific Fields
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'Offline', 'Emergency'],
    default: 'Offline'
  },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  performanceScore: { type: Number, default: 100 },
  completedTasks: { type: Number, default: 0 },
  averageResponseTime: { type: Number, default: 0 },
  skills: [{ type: String, enum: ['MEDICAL', 'SECURITY', 'CROWD_CONTROL', 'TECHNICAL', 'ACCESSIBILITY', 'GUEST_ASSISTANCE', 'EMERGENCY_RESPONSE', 'GENERAL'] }],
  specializations: [{ type: String }],
  currentZone: { type: String },
  assignedStadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium' },
  assignedMatch: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  shiftStart: { type: Date },
  shiftEnd: { type: Date },
  lastActiveAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
