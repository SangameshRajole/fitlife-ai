// =============================================
// routes/bmiRoutes.js
// =============================================

import express from 'express';
import {
  calculateBMI,
  getBMIHistory,
  getLatestBMI,
} from '../controllers/bmiController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected (need login)
router.post('/calculate', protect, calculateBMI);
router.get('/history',    protect, getBMIHistory);
router.get('/latest',     protect, getLatestBMI);

export default router;