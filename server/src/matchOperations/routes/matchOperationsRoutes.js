import express from 'express';
import { 
  getOperationsState, 
  startOperations, 
  endOperations, 
  triggerEmergency, 
  resolveEmergency 
} from '../controllers/matchOperationsController.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/:matchId', authorize('Admin', 'Organizer'), getOperationsState);
router.post('/:matchId/start', authorize('Admin', 'Organizer'), startOperations);
router.post('/:matchId/end', authorize('Admin', 'Organizer'), endOperations);
router.post('/:matchId/emergency', authorize('Admin', 'Organizer'), triggerEmergency);
router.post('/:matchId/resolve-emergency', authorize('Admin', 'Organizer'), resolveEmergency);

export default router;
