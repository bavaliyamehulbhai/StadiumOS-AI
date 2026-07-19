import express from 'express';
import {
  createMatch,
  getMatches,
  getMatchById,
  updateMatch,
  deleteMatch,
  changeMatchStatus
} from '../controllers/matchController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateMatch } from '../validators/matchValidator.js';

const router = express.Router();

// Publicly readable for all authenticated users
router.route('/')
  .get(protect, getMatches)
  .post(protect, authorize('Admin'), validateMatch, createMatch);

router.route('/:id')
  .get(protect, getMatchById)
  .put(protect, authorize('Admin'), validateMatch, updateMatch)
  .delete(protect, authorize('Admin'), deleteMatch);

// Dedicated route for status changes (e.g. from Organizer/Admin panels)
router.route('/:id/status')
  .patch(protect, authorize('Admin', 'Organizer'), changeMatchStatus);

export default router;
