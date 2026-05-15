// =============================================
// middleware/authMiddleware.js
// JWT Token Checker — Protects private routes
// =============================================
// This runs BEFORE any protected API route
// Think of it as a security guard at the door

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in request headers
    // Frontend sends token like: Authorization: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract the token (remove "Bearer " prefix)
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login first.',
      });
    }

    // Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user from the token's ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.',
      });
    }

    // Attach user to request object
    // Now any route after this can access req.user
    req.user = user;

    // Move to the next function (the actual route)
    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized. Token invalid or expired.',
    });
  }
};

export default protect;