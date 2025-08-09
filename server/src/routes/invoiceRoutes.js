import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { validateInvoice, validateInvoiceItem } from '../middleware/validate.js';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoiceItems,
  createInvoiceItem,
} from '../controllers/invoiceController.js';

const router = express.Router();

router.get('/', authMiddleware, getInvoices);
router.get('/:id', authMiddleware, getInvoiceById);
router.post('/', authMiddleware, validateInvoice, createInvoice);
router.put('/:id', authMiddleware, validateInvoice, updateInvoice);
router.delete('/:id', authMiddleware, deleteInvoice);
router.get('/:id/items', authMiddleware, getInvoiceItems);
router.post('/:id/items', authMiddleware, validateInvoiceItem, createInvoiceItem);

export default router;