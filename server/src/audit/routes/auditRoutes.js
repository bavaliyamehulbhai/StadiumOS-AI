import express from 'express';
import { getAuditLogs, getAuditStats } from '../controllers/auditController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('Admin', 'Organizer'));

router.get('/', getAuditLogs);
router.get('/stats', getAuditStats);

export default router;
