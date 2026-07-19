import mongoose from 'mongoose';

const userLanguagePreferenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  preferredLanguage: { type: String, default: 'en' },
  fallbackLanguage: { type: String, default: 'en' },
  autoDetect: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('UserLanguagePreference', userLanguagePreferenceSchema);
