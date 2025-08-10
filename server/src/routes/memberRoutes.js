import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { validateMember } from '../middlewares/validate.js';
import {
  getMembers,
  getMemberByIdController,
  createMemberController,
  updateMemberController,
  deleteMemberController,
} from '../controllers/memberController.js';

const router = express.Router();

router.get('/', getMembers);
router.get('/:id', getMemberByIdController);
router.post('/', validateMember, createMemberController);
router.put('/:id', validateMember, updateMemberController);
router.delete('/:id', deleteMemberController);

export default router;