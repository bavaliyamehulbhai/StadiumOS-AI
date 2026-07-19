import express from 'express';
import { 
  getAllCrowdData, 
  getCrowdByCategory, 
  getCrowdAnalytics, 
  getHeatmapData,
  simulateCrowdMovement 
} from '../controllers/crowdController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Fan accessible routes
router.get('/', getAllCrowdData);
router.get('/category/:category', getCrowdByCategory);
router.get('/heatmap', getHeatmapData);

// Simulator endpoint (normally hidden in prod, open for hackathon)
router.post('/simulate', simulateCrowdMovement);

// Organizer / Admin analytics
router.get('/analytics', protect, authorize('Organizer', 'Admin'), getCrowdAnalytics);

export default router;
