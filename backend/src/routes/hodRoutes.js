const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getDashboardOverview,
  getAllStudents,
  getAllProfessors,
  getHODProfile,
  updateHODProfile,
  getStudentAttendanceForHOD,
  getExamResultsForHOD
} = require('../controllers/hodController');

// HOD Dashboard Routes

// GET /api/hod/dashboard/stats - Get dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

// GET /api/hod/dashboard/overview - Get dashboard overview data
router.get('/dashboard/overview', getDashboardOverview);

// GET /api/hod/students - Get all students (with pagination and filters)
router.get('/students', getAllStudents);

// GET /api/hod/professors - Get all professors (with pagination and filters)
router.get('/professors', getAllProfessors);

// GET /api/hod/profile/:userId - Get HOD profile
router.get('/profile/:userId', getHODProfile);

// PUT /api/hod/profile/:userId - Update HOD profile
router.put('/profile/:userId', updateHODProfile);

// GET /api/hod/attendance/students - Get student attendance for HOD
router.get('/attendance/students', getStudentAttendanceForHOD);

// GET /api/hod/results - Get exam results for HOD
router.get('/results', getExamResultsForHOD);

module.exports = router;
