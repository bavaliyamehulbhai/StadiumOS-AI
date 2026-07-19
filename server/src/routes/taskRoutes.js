import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  assignTask,
  acceptTask,
  startTask,
  completeTask,
  verifyTask,
  cancelTask,
  deleteTask
} from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateTask } from '../validators/taskValidator.js';

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, authorize('Organizer', 'Admin'), validateTask, createTask);

router.route('/:id')
  .get(protect, getTaskById)
  .delete(protect, authorize('Admin'), deleteTask);

router.route('/:id/assign')
  .patch(protect, authorize('Organizer', 'Admin'), assignTask);

router.route('/:id/accept')
  .patch(protect, authorize('Volunteer'), acceptTask);

router.route('/:id/start')
  .patch(protect, authorize('Volunteer'), startTask);

router.route('/:id/complete')
  .patch(protect, authorize('Volunteer'), completeTask);

router.route('/:id/verify')
  .patch(protect, authorize('Organizer', 'Admin'), verifyTask);

router.route('/:id/cancel')
  .patch(protect, authorize('Organizer', 'Admin'), cancelTask);

export default router;
