import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/tasksController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Apply auth middleware to all routes

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
