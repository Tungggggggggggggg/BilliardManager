import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { validateTable } from '../middleware/validate.js';
import {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
} from '../controllers/tableController.js';

const router = express.Router();

router.get('/', authMiddleware, getTables);
router.get('/:id', authMiddleware, getTableById);
router.post('/', authMiddleware, validateTable, createTable);
router.put('/:id', authMiddleware, validateTable, updateTable);
router.delete('/:id', authMiddleware, deleteTable);

export default router;