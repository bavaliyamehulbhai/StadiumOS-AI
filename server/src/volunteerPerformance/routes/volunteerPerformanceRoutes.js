import express from 'express';
import {
  getOverview,
  getVolunteers,
  getVolunteerProfile,
  getWorkload,
  getRecommendations
} from '../controllers/volunteerPerformanceController.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Require authentication for all performance routes
router.use(protect);

// Allow Organizer and Admin to view all performance data
router.get('/overview', authorize('Organizer', 'Admin'), getOverview);
router.get('/volunteers', authorize('Organizer', 'Admin'), getVolunteers);
router.get('/workload', authorize('Organizer', 'Admin'), getWorkload);
router.post('/recommend', authorize('Organizer', 'Admin'), getRecommendations);

// Allow Organizer, Admin, AND the Volunteer themselves to view specific profile
router.get('/volunteers/:id', (req, res, next) => {
  // Check if user is Volunteer viewing their own data
  if (req.user.role === 'Volunteer' && req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: 'Not authorized to view other volunteer profiles' });
  }
  // Otherwise, authorize for Organizer/Admin
  if (req.user.role === 'Fan' || (req.user.role === 'Volunteer' && req.user._id.toString() !== req.params.id)) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  next();
}, getVolunteerProfile);

export default router;
