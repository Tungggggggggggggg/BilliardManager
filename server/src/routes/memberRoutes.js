import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { validateMember } from '../middleware/validate.js';
import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} from '../controllers/memberController.js';

const router = express.Router();

router.get('/', authMiddleware, getMembers);
router.get('/:id', authMiddleware, getMemberById);
router.post('/', authMiddleware, validateMember, createMember);
router.put('/:id', authMiddleware, validateMember, updateMember);
router.delete('/:id', authMiddleware, deleteMember);

export default router;