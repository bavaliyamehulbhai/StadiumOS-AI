import express from 'express';
import { getLiveCrowd, getGates, getParking } from '../controllers/crowdController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/live', getLiveCrowd);
router.get('/gates', getGates);
router.get('/parking', getParking);

export default router;
