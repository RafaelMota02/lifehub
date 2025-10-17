import express from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/notesController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Apply auth middleware to all routes

router.get('/', getNotes);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
