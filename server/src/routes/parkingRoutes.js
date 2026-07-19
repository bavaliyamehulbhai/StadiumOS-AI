import express from 'express';
import { getParkingByStadium, reserveParking, getMyReservations } from '../controllers/parkingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/my-reservations', getMyReservations);
router.get('/:stadiumId', getParkingByStadium);
router.post('/reserve', reserveParking);

export default router;
