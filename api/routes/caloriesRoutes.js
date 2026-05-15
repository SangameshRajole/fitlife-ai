// =============================================
// routes/caloriesRoutes.js
// =============================================

import express from 'express';
import {
  addMeal,
  getTodayMeals,
  getCaloriesHistory,
  deleteMeal,
} from '../controllers/caloriesController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add',      protect, addMeal);
router.get('/today',     protect, getTodayMeals);
router.get('/history',   protect, getCaloriesHistory);
router.delete('/:id',    protect, deleteMeal);

export default router;