import express from 'express';
import rateLimit from 'express-rate-limit';
import { 
  handleChat, 
  handleNavigation, 
  handleIncidentSummary, 
  handleCrowdAnalysis, 
  handleEmergency,
  getHistory,
  clearHistory,
  getPrompts
} from '../controllers/assistantController.js';
import { 
  chatSchema, 
  navigationSchema, 
  incidentSchema, 
  crowdSchema, 
  emergencySchema, 
  validateRequest 
} from '../validators/aiValidator.js';
import { protect } from '../../middleware/authMiddleware.js';
import { authorizeRoles } from '../../middleware/roleMiddleware.js';

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // increased limit for dev
  message: { success: false, message: 'Too many requests. Please wait a moment before trying again.' }
});

// Do NOT use aiLimiter globally on the router so it doesn't block /history and /prompts
// router.use(aiLimiter);

router.post('/chat', protect, aiLimiter, validateRequest(chatSchema), handleChat);
router.post('/navigation', protect, aiLimiter, validateRequest(navigationSchema), handleNavigation);
router.post('/incident-summary', protect, authorizeRoles('Admin', 'Organizer'), aiLimiter, validateRequest(incidentSchema), handleIncidentSummary);
router.post('/crowd-analysis', protect, authorizeRoles('Admin', 'Organizer'), aiLimiter, validateRequest(crowdSchema), handleCrowdAnalysis);
router.post('/emergency', protect, aiLimiter, validateRequest(emergencySchema), handleEmergency);

// New Phase 2 Endpoints
router.get('/history', protect, getHistory);
router.delete('/history', protect, clearHistory);
router.get('/prompts', protect, getPrompts);

export default router;
