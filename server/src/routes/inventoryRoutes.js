import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { validateInventoryItem } from '../middlewares/validate.js';
import {
  getInventoryItemsController,
  getInventoryItemByIdController,
  createInventoryItemController,
  updateInventoryItemController,
  deleteInventoryItemController,
} from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', getInventoryItemsController);
router.get('/:id', getInventoryItemByIdController);
router.post('/', validateInventoryItem, createInventoryItemController);
router.put('/:id', validateInventoryItem, updateInventoryItemController);
router.delete('/:id', deleteInventoryItemController);

export default router;