// =============================================
// models/BMI.js — BMI Database Schema
// =============================================

import mongoose from 'mongoose';

const bmiSchema = new mongoose.Schema(
  {
    // Which user this BMI record belongs to
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    weight: {
      type: Number,
      required: true, // in kg
    },

    height: {
      type: Number,
      required: true, // in cm
    },

    bmi: {
      type: Number,
      required: true,
    },

    // BMI category
    category: {
      type: String,
      enum: ['Underweight', 'Normal', 'Overweight', 'Obese'],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('BMI', bmiSchema);