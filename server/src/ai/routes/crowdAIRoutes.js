import express from 'express';
import { getInsights, getPredictions, recommendGate, recommendVolunteers, queueAnalysis } from '../controllers/crowdAIController.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Require authentication

// Admin and Organizer only for most deep insights
router.post('/insights', authorize('Admin', 'Organizer'), getInsights);
router.post('/predict', authorize('Admin', 'Organizer'), getPredictions);
router.get('/recommend-volunteers', authorize('Admin', 'Organizer'), recommendVolunteers);
router.post('/queue-analysis', authorize('Admin', 'Organizer'), queueAnalysis);

// Fans can ask for gate recommendations
router.get('/recommend-gate', recommendGate);

export default router;
