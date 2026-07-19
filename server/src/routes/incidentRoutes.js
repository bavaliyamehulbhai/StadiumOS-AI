import express from 'express';
import {
  createIncident,
  getAllIncidents,
  getIncidentById,
  assignVolunteer,
  changeStatus,
  deleteIncident
} from '../controllers/incidentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateIncident } from '../validators/incidentValidator.js';

const router = express.Router();

router.route('/')
  .get(protect, getAllIncidents)
  .post(protect, validateIncident, createIncident); // Anyone authenticated can report

router.route('/:id')
  .get(protect, getIncidentById)
  .delete(protect, deleteIncident);

router.route('/:id/assign')
  .patch(protect, authorize('Organizer', 'Admin'), assignVolunteer); // Rule 3

router.route('/:id/status')
  .patch(protect, changeStatus); // Access control enforced inside controller (Rule 4, 6)

export default router;
