// =============================================
// controllers/waterController.js
// =============================================

import Water from '../models/Water.js';

// Helper: get today's date as YYYY-MM-DD
const getToday = () => new Date().toISOString().split('T')[0];

// =============================================
// ADD WATER ENTRY
// POST /api/water/add
// =============================================
export const addWater = async (req, res) => {
  try {
    const { amount, label, dailyGoal } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount',
      });
    }

    const entry = await Water.create({
      user: req.user.id,
      amount,
      label: label || 'Water',
      dailyGoal: dailyGoal || 2000,
      date: getToday(),
    });

    res.status(201).json({
      success: true,
      message: 'Water intake logged! 💧',
      data: entry,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// GET TODAY'S WATER ENTRIES
// GET /api/water/today
// =============================================
export const getTodayWater = async (req, res) => {
  try {
    const entries = await Water.find({
      user: req.user.id,
      date: getToday(),
    }).sort({ createdAt: -1 });

    // Total water consumed today
    const total = entries.reduce((sum, e) => sum + e.amount, 0);
    const goal  = entries[0]?.dailyGoal || 2000;

    res.status(200).json({
      success: true,
      data: {
        entries,
        total,
        goal,
        percentage: Math.min(Math.round((total / goal) * 100), 100),
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// GET WATER HISTORY (last 7 days)
// GET /api/water/history
// =============================================
export const getWaterHistory = async (req, res) => {
  try {
    // Get last 7 days dates
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    // For each day, sum up water intake
    const history = await Promise.all(
      days.map(async (date) => {
        const entries = await Water.find({ user: req.user.id, date });
        const total   = entries.reduce((sum, e) => sum + e.amount, 0);
        const goal    = entries[0]?.dailyGoal || 2000;
        return { date, total, goal };
      })
    );

    res.status(200).json({ success: true, data: history });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// DELETE WATER ENTRY
// DELETE /api/water/:id
// =============================================
export const deleteWater = async (req, res) => {
  try {
    await Water.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Entry deleted!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};