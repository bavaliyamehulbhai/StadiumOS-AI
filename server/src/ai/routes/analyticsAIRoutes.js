import express from 'express';
import { generateAnalytics, getDashboardSummary } from '../controllers/analyticsAIController.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Both Admins and Organizers can access CEO Analytics
router.use(protect);
router.use(authorize('Admin', 'Organizer'));

// POST /api/v1/ai/analytics/generate - Force generate new AI analytics
router.post('/generate', generateAnalytics);

// GET /api/v1/ai/analytics/dashboard - Fetch latest (cached or new) analytics
router.get('/dashboard', getDashboardSummary);

export default router;
