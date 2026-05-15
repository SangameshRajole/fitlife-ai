// =============================================
// models/Water.js
// =============================================

import mongoose from 'mongoose';

const waterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Amount in ml
    amount: {
      type: Number,
      required: true,
    },

    // Daily goal in ml (default 2000ml = 2L)
    dailyGoal: {
      type: Number,
      default: 2000,
    },

    // Label like "Morning glass", "After workout"
    label: {
      type: String,
      default: 'Water',
    },

    // Date of this entry (for grouping by day)
    date: {
      type: String, // stored as "YYYY-MM-DD"
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Water', waterSchema);