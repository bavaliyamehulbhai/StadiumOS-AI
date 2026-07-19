import express from 'express';
import { getRoute, getNearbyFacilities, getRouteOptions } from '../controllers/navigationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Navigation endpoints
router.get('/route', protect, getRoute);
router.get('/nearby', protect, getNearbyFacilities);
router.get('/options', protect, getRouteOptions);

export default router;
