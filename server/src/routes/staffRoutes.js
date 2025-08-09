import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { validateStaff } from '../middleware/validate.js';
import {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} from '../controllers/staffController.js';

const router = express.Router();

router.get('/', authMiddleware, getStaff);
router.get('/:id', authMiddleware, getStaffById);
router.post('/', authMiddleware, validateStaff, createStaff);
router.put('/:id', authMiddleware, validateStaff, updateStaff);
router.delete('/:id', authMiddleware, deleteStaff);

export default router;