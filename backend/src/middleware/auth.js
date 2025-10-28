const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Verify JWT Token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Access token required'
        }
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'User not found'
        }
      });
    }

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token'
        }
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token expired'
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        message: 'Authentication failed',
        details: error.message
      }
    });
  }
};

// Check if user has specific role
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required'
        }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Insufficient permissions'
        }
      });
    }

    next();
  };
};

// Check if user is student
const authorizeStudent = authorizeRole('student');

// Check if user is professor
const authorizeProfessor = authorizeRole('professor');

// Check if user is HOD
const authorizeHOD = authorizeRole('hod');

// Check if user is professor or HOD
const authorizeProfessorOrHOD = authorizeRole('professor', 'hod');

// Check if user is any authenticated user
const authorizeAny = authorizeRole('student', 'professor', 'hod');

module.exports = {
  authenticateToken,
  authorizeRole,
  authorizeStudent,
  authorizeProfessor,
  authorizeHOD,
  authorizeProfessorOrHOD,
  authorizeAny
};
