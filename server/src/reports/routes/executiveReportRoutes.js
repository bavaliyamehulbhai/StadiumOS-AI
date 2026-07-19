import express from 'express';
import {
  getReports,
  getReportById,
  generateReport,
  regenerateAIAnalysis,
  deleteReport
} from '../controllers/executiveReportController.js';
import { protect, authorize } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Admin', 'Organizer')); // Only Admins and Organizers can access executive reports

router.route('/')
  .get(getReports)
  .post(generateReport);

router.route('/:id')
  .get(getReportById)
  .delete(authorize('Admin'), deleteReport); // Only Admins can delete

router.post('/:id/regenerate-ai', regenerateAIAnalysis);

export default router;
