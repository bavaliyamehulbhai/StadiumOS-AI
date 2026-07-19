import express from 'express';
import { getCommandCenterDashboard } from '../controllers/commandCenterController.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Organizer', 'Admin'));

router.get('/', getCommandCenterDashboard);

export default router;
