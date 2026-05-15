// =============================================
// models/Calories.js
// =============================================

import mongoose from 'mongoose';

const caloriesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Meal name e.g. "Chicken Rice"
    mealName: {
      type: String,
      required: [true, 'Please enter meal name'],
      trim: true,
    },

    // Calories in kcal
    calories: {
      type: Number,
      required: [true, 'Please enter calories'],
    },

    // Meal type
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
      default: 'Snack',
    },

    // Daily calorie goal
    dailyGoal: {
      type: Number,
      default: 2000,
    },

    // Date for grouping
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Calories', caloriesSchema);