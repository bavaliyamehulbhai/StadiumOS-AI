import AccessibilityProfile from '../models/AccessibilityProfile.js';
import Facility from '../models/Facility.js';

// Get current user's accessibility profile
export const getProfile = async (req, res) => {
  try {
    let profile = await AccessibilityProfile.findOne({ user: req.user.id });
    
    // Create default profile if not exists
    if (!profile) {
      profile = await AccessibilityProfile.create({ user: req.user.id });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update accessibility profile
export const updateProfile = async (req, res) => {
  try {
    let profile = await AccessibilityProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      profile = new AccessibilityProfile({ user: req.user.id });
    }

    // Update fields
    const fields = ['wheelchair', 'visualSupport', 'hearingSupport', 'seniorCitizen', 'language', 'highContrast', 'largeText', 'preferredGate', 'emergencyContact'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get facilities by stadium ID
export const getFacilities = async (req, res) => {
  try {
    const { stadiumId } = req.params;
    const facilities = await Facility.find({ stadium: stadiumId });
    
    res.status(200).json({ success: true, count: facilities.length, data: facilities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
