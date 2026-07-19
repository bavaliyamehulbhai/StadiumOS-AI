import express from 'express';
import { getProfile, updateProfile, getFacilities } from '../controllers/accessibilityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Profile routes
router.route('/profile')
  .get(protect, getProfile)
  .patch(protect, updateProfile);

// Facility routes
router.route('/facilities/:stadiumId')
  .get(getFacilities);

export default router;
