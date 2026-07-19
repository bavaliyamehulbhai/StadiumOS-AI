import express from 'express';
import {
  getAllStadiumMaps,
  getStadiumMapDetails,
  getStadiumPOIs,
  searchMap
} from '../controllers/mapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stadiums', protect, getAllStadiumMaps);
router.get('/search', protect, searchMap);
router.get('/stadium/:id', protect, getStadiumMapDetails);
router.get('/stadium/:id/pois', protect, getStadiumPOIs);

export default router;
