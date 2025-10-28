const express = require('express');
const router = express.Router();

const {
  studentSignup,
  professorSignup,
  hodSignup,
  login,
  getCurrentUser,
  changePassword,
  logout
} = require('../controllers/authController');

const {
  authenticateToken,
  authorizeStudent,
  authorizeProfessor,
  authorizeHOD,
  authorizeAny
} = require('../middleware/auth');

// NO VALIDATION MIDDLEWARE

// Public Routes (No authentication required)

// POST /api/auth/student/signup - Student signup
router.post('/student/signup', studentSignup);

// POST /api/auth/professor/signup - Professor signup
router.post('/professor/signup', professorSignup);

// POST /api/auth/hod/signup - HOD signup
router.post('/hod/signup', hodSignup);

// POST /api/auth/login - Login
router.post('/login', login);

// Protected Routes (Authentication required)

// GET /api/auth/me - Get current user
router.get('/me', authenticateToken, getCurrentUser);

// POST /api/auth/change-password - Change password
router.post('/change-password', authenticateToken, changePassword);

// POST /api/auth/logout - Logout
router.post('/logout', authenticateToken, logout);

// Role-specific protected routes

// GET /api/auth/student/profile - Get student profile (student only)
router.get('/student/profile', authenticateToken, authorizeStudent, getCurrentUser);

// GET /api/auth/professor/profile - Get professor profile (professor only)
router.get('/professor/profile', authenticateToken, authorizeProfessor, getCurrentUser);

// GET /api/auth/hod/profile - Get HOD profile (HOD only)
router.get('/hod/profile', authenticateToken, authorizeHOD, getCurrentUser);

module.exports = router;
