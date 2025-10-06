import express from 'express';
import {
  getFinancialEntries,
  createFinancialEntry,
  updateFinancialEntry,
  deleteFinancialEntry
} from '../controllers/financesController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth); // Apply auth middleware to all routes

router.get('/', getFinancialEntries);
router.post('/', createFinancialEntry);
router.put('/:id', updateFinancialEntry);
router.delete('/:id', deleteFinancialEntry);

export default router;
