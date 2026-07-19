import express from 'express';
import { getMyTickets, getTicket, cancelTicket, scanTicket } from '../controllers/ticketController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Fan routes
router.get('/my', protect, getMyTickets);
router.get('/:id', protect, getTicket);
router.patch('/:id/cancel', protect, cancelTicket);

// Organizer routes
router.post('/scan', protect, authorize('Organizer', 'Admin'), scanTicket);

export default router;
