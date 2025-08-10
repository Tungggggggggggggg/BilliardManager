import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { validateInvoice, validateInvoiceItem } from '../middlewares/validate.js';
import {
  getInvoicesController,
  getInvoiceByIdController,
  createInvoiceController,
  updateInvoiceController,
  deleteInvoiceController,
  getInvoiceItemsController,
  createInvoiceItemController,
} from '../controllers/invoiceController.js';

const router = express.Router();

router.get('/', getInvoicesController);
router.get('/:id', getInvoiceByIdController);
router.post('/', validateInvoice, createInvoiceController);
router.put('/:id', validateInvoice, updateInvoiceController);
router.delete('/:id', deleteInvoiceController);
router.get('/:id/items', getInvoiceItemsController);
router.post('/:id/items', validateInvoiceItem, createInvoiceItemController);

export default router;