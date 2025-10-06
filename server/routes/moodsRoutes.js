import express from 'express';
import {
  getMoodEntries,
  createMoodEntry
} from '../controllers/moodsController.js';

const router = express.Router();

router.get('/', getMoodEntries);
router.post('/', createMoodEntry);

export default router;
