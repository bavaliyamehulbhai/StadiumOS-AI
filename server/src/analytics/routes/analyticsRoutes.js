import express from 'express';
import { getOverview, getTrends, getExecutiveSummary } from '../controllers/analyticsController.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

// All analytics routes are protected and require Admin or Organizer roles
router.use(protect);
router.use(authorize('Admin', 'Organizer'));

router.route('/overview').get(getOverview);
router.route('/trends').get(getTrends);
router.route('/executive-summary').post(getExecutiveSummary);

export default router;
