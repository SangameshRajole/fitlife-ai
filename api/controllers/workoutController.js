// =============================================
// controllers/workoutController.js
// =============================================

import Workout from '../models/Workout.js';

const getToday = () => new Date().toISOString().split('T')[0];

// =============================================
// ADD WORKOUT
// POST /api/workout/add
// =============================================
export const addWorkout = async (req, res) => {
  try {
    const {
      workoutName,
      workoutType,
      duration,
      caloriesBurned,
      intensity,
      notes,
    } = req.body;

    if (!workoutName || !duration || !caloriesBurned) {
      return res.status(400).json({
        success: false,
        message: 'Please provide workout name, duration and calories burned',
      });
    }

    const workout = await Workout.create({
      user: req.user.id,
      workoutName,
      workoutType: workoutType || 'Other',
      duration,
      caloriesBurned,
      intensity: intensity || 'Medium',
      notes: notes || '',
      date: getToday(),
    });

    res.status(201).json({
      success: true,
      message: 'Workout logged! 💪',
      data: workout,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// GET TODAY'S WORKOUTS
// GET /api/workout/today
// =============================================
export const getTodayWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({
      user: req.user.id,
      date: getToday(),
    }).sort({ createdAt: -1 });

    const totalDuration = workouts.reduce((s, w) => s + w.duration, 0);
    const totalCalories = workouts.reduce((s, w) => s + w.caloriesBurned, 0);

    res.status(200).json({
      success: true,
      data: { workouts, totalDuration, totalCalories, count: workouts.length },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// GET WORKOUT HISTORY (last 7 days)
// GET /api/workout/history
// =============================================
export const getWorkoutHistory = async (req, res) => {
  try {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    const history = await Promise.all(
      days.map(async (date) => {
        const workouts     = await Workout.find({ user: req.user.id, date });
        const totalCalories = workouts.reduce((s, w) => s + w.caloriesBurned, 0);
        const totalDuration = workouts.reduce((s, w) => s + w.duration, 0);
        return { date, count: workouts.length, totalCalories, totalDuration };
      })
    );

    res.status(200).json({ success: true, data: history });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// GET ALL WORKOUTS
// GET /api/workout/all
// =============================================
export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, data: workouts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// DELETE WORKOUT
// DELETE /api/workout/:id
// =============================================
export const deleteWorkout = async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Workout deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};