// =============================================
// routes/waterRoutes.js
// =============================================

import express from 'express';
import {
  addWater,
  getTodayWater,
  getWaterHistory,
  deleteWater,
} from '../controllers/waterController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add',        protect, addWater);
router.get('/today',       protect, getTodayWater);
router.get('/history',     protect, getWaterHistory);
router.delete('/:id',      protect, deleteWater);

export default router;