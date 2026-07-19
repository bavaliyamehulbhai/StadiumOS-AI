import mongoose from 'mongoose';

const accessibilityProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  wheelchair: { type: Boolean, default: false },
  visualSupport: { type: Boolean, default: false },
  hearingSupport: { type: Boolean, default: false },
  seniorCitizen: { type: Boolean, default: false },
  language: { type: String, default: 'English' },
  highContrast: { type: Boolean, default: false },
  largeText: { type: Boolean, default: false },
  preferredGate: { type: String, default: '' },
  emergencyContact: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('AccessibilityProfile', accessibilityProfileSchema);
