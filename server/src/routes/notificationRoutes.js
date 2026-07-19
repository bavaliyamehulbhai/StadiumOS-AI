import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllRead,
  archiveNotification,
  pinNotification,
  deleteNotification,
  clearNotifications
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
  .get(getNotifications)
  .delete(clearNotifications);

router.route('/unread-count')
  .get(getUnreadCount);

router.route('/read-all')
  .patch(markAllRead);

router.route('/:id/read')
  .patch(markAsRead);

router.route('/:id/archive')
  .patch(archiveNotification);

router.route('/:id/pin')
  .patch(pinNotification);

router.route('/:id')
  .delete(deleteNotification);

export default router;
