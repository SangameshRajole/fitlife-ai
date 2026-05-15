// =============================================
// controllers/bmiController.js
// =============================================

import BMI from '../models/BMI.js';

// Helper: Calculate BMI category
const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25)   return 'Normal';
  if (bmi < 30)   return 'Overweight';
  return 'Obese';
};

// =============================================
// CALCULATE & SAVE BMI
// POST /api/bmi/calculate
// =============================================
export const calculateBMI = async (req, res) => {
  try {
    const { weight, height } = req.body;

    if (!weight || !height) {
      return res.status(400).json({
        success: false,
        message: 'Please provide weight and height',
      });
    }

    // BMI Formula: weight(kg) / height(m)²
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    const category = getBMICategory(parseFloat(bmi));

    // Save to database
    const record = await BMI.create({
      user: req.user.id,
      weight,
      height,
      bmi: parseFloat(bmi),
      category,
    });

    res.status(201).json({
      success: true,
      message: 'BMI calculated successfully!',
      data: record,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// GET BMI HISTORY
// GET /api/bmi/history
// =============================================
export const getBMIHistory = async (req, res) => {
  try {
    const history = await BMI.find({ user: req.user.id })
      .sort({ createdAt: -1 }) // newest first
      .limit(10);

    res.status(200).json({
      success: true,
      data: history,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// GET LATEST BMI
// GET /api/bmi/latest
// =============================================
export const getLatestBMI = async (req, res) => {
  try {
    const latest = await BMI.findOne({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: latest,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};