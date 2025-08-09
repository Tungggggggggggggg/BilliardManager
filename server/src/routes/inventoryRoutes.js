import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { validateInventoryItem } from '../middleware/validate.js';
import {
  getInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', authMiddleware, getInventoryItems);
router.get('/:id', authMiddleware, getInventoryItemById);
router.post('/', authMiddleware, validateInventoryItem, createInventoryItem);
router.put('/:id', authMiddleware, validateInventoryItem, updateInventoryItem);
router.delete('/:id', authMiddleware, deleteInventoryItem);

export default router;