import express from 'express';
import { 
  handleTranslate, 
  handleDetect, 
  getLanguages, 
  getUserPreferences, 
  updateUserPreferences 
} from '../controllers/languageAIController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public / Global
router.get('/supported', getLanguages);
router.post('/detect', handleDetect);

// Protected (requires user context)
router.use(protect);
router.post('/translate', handleTranslate);
router.get('/preferences', getUserPreferences);
router.patch('/preferences', updateUserPreferences);

export default router;
