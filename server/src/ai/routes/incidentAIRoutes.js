import express from 'express';
import { getAIAnalysis, generateAIAnalysis } from '../controllers/incidentAIController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/roleMiddleware.js';

const router = express.Router();

// Only Organizers and Admins should access detailed AI analysis
router.use(protect);
router.use(authorizeRoles('Admin', 'Organizer'));

router.get('/:id', getAIAnalysis);
router.post('/:id/analyze', generateAIAnalysis);

export default router;
