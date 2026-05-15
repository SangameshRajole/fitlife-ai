// =============================================
// controllers/authController.js
// Logic for Register and Login
// =============================================

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// =============================================
// HELPER: Generate JWT Token
// =============================================
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },           // Payload (what we store in token)
    process.env.JWT_SECRET,   // Secret key from .env
    { expiresIn: process.env.JWT_EXPIRE } // Token expiry
  );
};

// =============================================
// REGISTER — POST /api/auth/register
// Creates a new user account
// =============================================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered. Please login.',
      });
    }

    // Create new user in database
    // Password is automatically encrypted by our User model
    const user = await User.create({ name, email, password });

    // Generate JWT token for the new user
    const token = generateToken(user._id);

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================================
// LOGIN — POST /api/auth/login
// Logs in existing user
// =============================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email }).select('+password');

    // If user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare entered password with stored encrypted password
    const isMatch = await user.comparePassword(password);

    // If password doesn't match
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Send success response
    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================================
// GET PROFILE — GET /api/auth/me
// Returns logged in user's data
// =============================================
export const getMe = async (req, res) => {
  try {
    // req.user is set by our auth middleware
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================================
// UPDATE PROFILE — PUT /api/auth/update
// Updates user's health info
// =============================================
export const updateProfile = async (req, res) => {
  try {
    const { name, age, gender, height, weight } = req.body;

    // Find user and update
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, age, gender, height, weight },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};