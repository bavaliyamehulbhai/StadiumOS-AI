import express from 'express';
import { getChatHistory, deleteChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getChatHistory);
router.route('/:id').delete(protect, deleteChat);

export default router;
