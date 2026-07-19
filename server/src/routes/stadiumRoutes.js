import express from 'express';
import {
  createStadium,
  getAllStadiums,
  getStadiumById,
  updateStadium,
  deleteStadium
} from '../controllers/stadiumController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateStadium } from '../validators/stadiumValidator.js';

const router = express.Router();

// Publicly readable for authenticated users
router.route('/')
  .get(protect, getAllStadiums)
  .post(protect, authorize('Admin'), validateStadium, createStadium);

router.route('/:id')
  .get(protect, getStadiumById)
  .put(protect, authorize('Admin'), validateStadium, updateStadium)
  .delete(protect, authorize('Admin'), deleteStadium);

export default router;
