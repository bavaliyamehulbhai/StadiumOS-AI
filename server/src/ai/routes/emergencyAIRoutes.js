import express from 'express';
import {
  analyzeEmergency,
  getSafeRoute,
  getEvacuationPlan,
  getMedicalGuidance,
  getResourcePlanRoute,
  getAnalysis
} from '../controllers/emergencyAIController.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Full AI Command Brief — Organizer + Admin only
router.post('/analyze', authorize('Admin', 'Organizer'), analyzeEmergency);

// Evacuation plan — Organizer + Admin
router.post('/evacuation', authorize('Admin', 'Organizer'), getEvacuationPlan);

// Resource planning — Organizer + Admin
router.post('/resources', authorize('Admin', 'Organizer'), getResourcePlanRoute);

// Fetch saved analysis — Organizer + Admin
router.get('/:id', authorize('Admin', 'Organizer'), getAnalysis);

// Safe route — all authenticated roles (Fans need this during emergencies)
router.post('/route', getSafeRoute);

// Medical guidance — all authenticated roles
router.post('/medical', getMedicalGuidance);

export default router;
