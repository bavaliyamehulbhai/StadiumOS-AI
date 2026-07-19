import express from 'express';
import {
  getActiveBroadcasts,
  getBroadcastHistory,
  getBroadcastById,
  createBroadcastDraft,
  activateBroadcast,
  resolveBroadcast,
  acknowledgeBroadcast
} from '../controllers/emergencyBroadcastController.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

// Public/fan accessible endpoints (read only)
router.route('/active').get(getActiveBroadcasts);
router.route('/:id/acknowledge').post(acknowledgeBroadcast);

// Admin / Organizer only endpoints
router.use(authorize('Admin', 'Organizer'));

router.route('/')
  .get(getBroadcastHistory)
  .post(createBroadcastDraft);

router.route('/:id')
  .get(getBroadcastById);

router.route('/:id/activate')
  .post(activateBroadcast);

router.route('/:id/resolve')
  .post(resolveBroadcast);

export default router;
