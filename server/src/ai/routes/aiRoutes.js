import express from 'express';
import rateLimit from 'express-rate-limit';
import { 
  handleChat, 
  handleNavigation, 
  handleIncidentSummary, 
  handleCrowdAnalysis, 
  handleEmergency 
} from '../controllers/aiController.js';
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

// Rate limiting (using memory store for simplicity as requested)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per windowMs
  message: { success: false, message: 'Too many requests. Please wait a moment before trying again.' }
});

router.use(aiLimiter);

router.post('/chat', protect, validateRequest(chatSchema), handleChat);

router.post('/navigation', protect, validateRequest(navigationSchema), handleNavigation);

router.post('/incident-summary', protect, authorizeRoles('Admin', 'Organizer'), validateRequest(incidentSchema), handleIncidentSummary);

router.post('/crowd-analysis', protect, authorizeRoles('Admin', 'Organizer'), validateRequest(crowdSchema), handleCrowdAnalysis);

router.post('/emergency', protect, validateRequest(emergencySchema), handleEmergency);

export default router;
