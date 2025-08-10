import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { getRevenueDataController } from '../controllers/revenueController.js';

const router = express.Router();

router.get('/', getRevenueDataController);

export default router;