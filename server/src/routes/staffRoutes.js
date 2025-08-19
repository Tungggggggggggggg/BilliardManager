import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { validateStaffCreate, validateStaffUpdate } from '../middlewares/validate.js';

import {
  getStaffController,
  getStaffByIdController,
  createStaffController,
  updateStaffController,
  deleteStaffController,
} from '../controllers/staffController.js';

const router = express.Router();

router.get('/', getStaffController);
router.get('/:id', getStaffByIdController);
router.post('/', validateStaffCreate, createStaffController);
router.put('/:id', validateStaffUpdate, updateStaffController);
router.delete('/:id', deleteStaffController);

export default router;