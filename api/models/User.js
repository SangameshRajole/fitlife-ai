// =============================================
// models/User.js — User Database Schema
// =============================================
// This file defines how a User looks in our database
// Think of it as a form/template for user data

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    // User's email (must be unique)
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },

    // User's password (will be encrypted)
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries
    },

    // User's physical info for health tracking
    age: {
      type: Number,
      default: null,
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male',
    },

    height: {
      type: Number, // in cm
      default: null,
    },

    weight: {
      type: Number, // in kg
      default: null,
    },

    // Profile picture URL (optional)
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// =============================================
// ENCRYPT PASSWORD BEFORE SAVING
// This runs automatically before every save()
// =============================================
userSchema.pre('save', async function (next) {
  // Only encrypt if password was changed
  if (!this.isModified('password')) return next();

  // bcrypt encrypts the password (10 = strength level)
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// =============================================
// METHOD: Compare entered password with stored one
// Used during login
// =============================================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);