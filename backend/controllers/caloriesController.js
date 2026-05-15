// =============================================
// controllers/caloriesController.js
// =============================================

import Calories from '../models/Calories.js';

const getToday = () => new Date().toISOString().split('T')[0];

// =============================================
// ADD MEAL
// POST /api/calories/add
// =============================================
export const addMeal = async (req, res) => {
  try {
    const { mealName, calories, mealType, dailyGoal } = req.body;

    if (!mealName || !calories) {
      return res.status(400).json({
        success: false,
        message: 'Please provide meal name and calories',
      });
    }

    const meal = await Calories.create({
      user: req.user.id,
      mealName,
      calories,
      mealType: mealType || 'Snack',
      dailyGoal: dailyGoal || 2000,
      date: getToday(),
    });

    res.status(201).json({
      success: true,
      message: 'Meal logged successfully! 🍽️',
      data: meal,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// GET TODAY'S MEALS
// GET /api/calories/today
// =============================================
export const getTodayMeals = async (req, res) => {
  try {
    const meals = await Calories.find({
      user: req.user.id,
      date: getToday(),
    }).sort({ createdAt: -1 });

    const total    = meals.reduce((sum, m) => sum + m.calories, 0);
    const goal     = meals[0]?.dailyGoal || 2000;
    const remaining = Math.max(goal - total, 0);

    res.status(200).json({
      success: true,
      data: {
        meals,
        total,
        goal,
        remaining,
        percentage: Math.min(Math.round((total / goal) * 100), 100),
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// GET 7-DAY HISTORY
// GET /api/calories/history
// =============================================
export const getCaloriesHistory = async (req, res) => {
  try {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    const history = await Promise.all(
      days.map(async (date) => {
        const meals = await Calories.find({ user: req.user.id, date });
        const total = meals.reduce((sum, m) => sum + m.calories, 0);
        const goal  = meals[0]?.dailyGoal || 2000;
        return { date, total, goal };
      })
    );

    res.status(200).json({ success: true, data: history });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// DELETE MEAL
// DELETE /api/calories/:id
// =============================================
export const deleteMeal = async (req, res) => {
  try {
    await Calories.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Meal deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};