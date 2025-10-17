import express from 'express';
import {
  getMoodEntries,
  createMoodEntry
} from '../controllers/moodsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Apply auth middleware to all routes

router.get('/', getMoodEntries);
router.post('/', createMoodEntry);

export default router;
