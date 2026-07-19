import express from 'express';
import { protect, authorize } from '../../middleware/authMiddleware.js';
import {
  getOverview,
  getUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getConfig,
  updateConfig,
  getEmergencyRules,
  updateEmergencyRule,
  getSecurityOverview
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require Admin privileges
router.use(protect);
router.use(authorize('Admin'));

// Overview
router.route('/overview').get(getOverview);

// Security
router.route('/security').get(getSecurityOverview);

// Users
router.route('/users').get(getUsers);
router.route('/users/:id/status').patch(updateUserStatus);
router.route('/users/:id/role').patch(updateUserRole);
router.route('/users/:id').delete(deleteUser);

// System & AI Config
router.route('/config').get(getConfig).patch(updateConfig);

// Emergency Rules
router.route('/emergency-rules').get(getEmergencyRules);
router.route('/emergency-rules/:id').patch(updateEmergencyRule);

export default router;
