import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { updateVolunteerStatus, getVolunteerPerformance } from '../controllers/volunteerController.js';

const router = express.Router();

router.use(protect);

router.patch('/status', updateVolunteerStatus);
router.get('/performance', getVolunteerPerformance);

export default router;
