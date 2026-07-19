import express from 'express';
import { getTransportByStadium, getRecommendations } from '../controllers/transportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/recommendations/:stadiumId', getRecommendations);
router.get('/:stadiumId', getTransportByStadium);

export default router;
