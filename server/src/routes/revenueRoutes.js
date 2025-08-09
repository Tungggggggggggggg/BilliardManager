import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getRevenueData } from '../controllers/revenueController.js';

const router = express.Router();

router.get('/', authMiddleware, getRevenueData);

export default router;