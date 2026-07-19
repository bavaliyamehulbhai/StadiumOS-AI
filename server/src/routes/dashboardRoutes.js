import express from 'express';
import {
  getAdminDashboard,
  getOrganizerDashboard,
  getVolunteerDashboard,
  getFanDashboard,
  getActivities,
  getCharts,
  getLiveStatus
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All dashboard routes require auth

router.get('/admin', authorize('Admin'), getAdminDashboard);
router.get('/organizer', authorize('Organizer'), getOrganizerDashboard);
router.get('/volunteer', authorize('Volunteer'), getVolunteerDashboard);
router.get('/fan', authorize('Fan'), getFanDashboard);

router.get('/activities', getActivities);
router.get('/charts', authorize('Admin', 'Organizer'), getCharts);
router.get('/live-status', getLiveStatus);

export default router;
