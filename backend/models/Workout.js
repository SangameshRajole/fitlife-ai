// =============================================
// models/Workout.js
// =============================================

import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Workout name e.g. "Morning Run"
    workoutName: {
      type: String,
      required: [true, 'Please enter workout name'],
      trim: true,
    },

    // Workout category
    workoutType: {
      type: String,
      enum: ['Cardio', 'Strength', 'Yoga', 'Sports', 'HIIT', 'Other'],
      default: 'Other',
    },

    // Duration in minutes
    duration: {
      type: Number,
      required: [true, 'Please enter duration'],
    },

    // Calories burned
    caloriesBurned: {
      type: Number,
      required: [true, 'Please enter calories burned'],
    },

    // Intensity level
    intensity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },

    // Notes about workout
    notes: {
      type: String,
      default: '',
    },

    // Date for grouping
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Workout', workoutSchema);