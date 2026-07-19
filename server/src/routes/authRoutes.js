import express from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser, getUsers, updateUserProfile, updateUserPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { registerValidator, loginValidator } from '../validators/authValidators.js';

const router = express.Router();

router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getCurrentUser);
router.get('/users', protect, getUsers);
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);

export default router;
