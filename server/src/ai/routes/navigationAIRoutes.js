import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import { getSmartRoute } from '../controllers/navigationAIController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Main endpoint for getting AI recommendations
router.post('/', getSmartRoute);

// Placeholders for future endpoints as per spec
router.post('/compare', getSmartRoute); 
router.get('/best-gate', getSmartRoute);
router.get('/parking', getSmartRoute);
router.post('/emergency', getSmartRoute);
router.post('/accessible', (req, res, next) => {
  req.body.accessibilityMode = true;
  next();
}, getSmartRoute);

export default router;
