import express from 'express';
import {
  getHealth,
  getSystemHealthDetailed,
  getHealthHistory,
  getActiveIncidents,
  acknowledgeIncident,
  resolveIncident,
  forcePeriodicCheck
} from '../controllers/systemHealthController.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public lightweight health check
router.get('/', getHealth);

// Admin-only detailed monitoring endpoints
router.use(protect);
router.use(authorize('Admin'));

router.get('/detailed', getSystemHealthDetailed);
router.get('/history', getHealthHistory);
router.get('/incidents', getActiveIncidents);
router.patch('/incidents/:id/acknowledge', acknowledgeIncident);
router.patch('/incidents/:id/resolve', resolveIncident);
router.post('/check', forcePeriodicCheck);

export default router;
