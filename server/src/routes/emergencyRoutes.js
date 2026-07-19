import express from 'express';
import { 
  getActiveEmergencies, 
  reportEmergency, 
  getSafeRoute, 
  updateEmergencyStatus, 
  simulateEmergency 
} from '../controllers/emergencyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get active emergencies (Polling for Crisis Mode context)
router.get('/active', getActiveEmergencies);

// Get safe routed path avoiding the emergency coordinate
router.get('/route', getSafeRoute);

// Report an emergency via SOS (Requires logged in Fan/Volunteer)
router.post('/', protect, reportEmergency);

// Update emergency status (Organizer/Admin only)
router.patch('/:id', protect, authorize('Organizer', 'Admin'), updateEmergencyStatus);

// Simulate an emergency (for Hackathon demo)
router.post('/simulate', simulateEmergency);

export default router;
