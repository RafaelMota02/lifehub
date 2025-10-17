import express from 'express';
import { exportUserData, deleteAccount, updateProfile, changePassword, submitFeedback } from '../controllers/settingsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All settings routes require authentication
router.use(auth);

// Export user data
router.get('/export', exportUserData);

// Update user profile (username and email)
router.put('/profile', updateProfile);

// Change password
router.put('/password', changePassword);

// Delete account (destructive operation)
router.delete('/account', deleteAccount);

// Submit feedback
router.post('/feedback', submitFeedback);

export default router;
