import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { validateTable } from '../middlewares/validate.js';
import {
  getTablesController,
  getTableByIdController,
  createTableController,
  updateTableController,
  deleteTableController,
} from '../controllers/tableController.js';

const router = express.Router();

router.get('/', getTablesController);
router.get('/:id', getTableByIdController);
router.post('/', validateTable, createTableController);
router.put('/:id', validateTable, updateTableController);
router.delete('/:id', deleteTableController);

export default router;