// =============================================
// routes/workoutRoutes.js
// =============================================

import express from 'express';
import {
  addWorkout,
  getTodayWorkouts,
  getWorkoutHistory,
  getAllWorkouts,
  deleteWorkout,
} from '../controllers/workoutController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add',      protect, addWorkout);
router.get('/today',     protect, getTodayWorkouts);
router.get('/history',   protect, getWorkoutHistory);
router.get('/all',       protect, getAllWorkouts);
router.delete('/:id',    protect, deleteWorkout);

export default router;