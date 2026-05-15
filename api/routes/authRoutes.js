// =============================================
// routes/authRoutes.js
// URL paths for authentication
// =============================================

import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (no token needed)
router.post('/register', register);  // POST /api/auth/register
router.post('/login', login);        // POST /api/auth/login

// Protected routes (token required)
router.get('/me', protect, getMe);            // GET /api/auth/me
router.put('/update', protect, updateProfile); // PUT /api/auth/update

export default router;