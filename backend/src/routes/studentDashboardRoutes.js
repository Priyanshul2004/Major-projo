const express = require('express');
const router = express.Router();

console.log('=== STUDENT DASHBOARD ROUTES LOADING ===');
const {
  getStudentDashboardStats,
  getStudentRecentActivity,
  getMyAttendance,
  getAttendanceSummary,
  getAttendanceBySubject,
  getMyMaterials,
  getMaterialById,
  downloadMaterial,
  getMyResults,
  getResultById,
  getPerformanceSummary,
  getMyCommunications,
  askDoubt,
  getCommunicationById,
  getCommunicationStats
} = require('../controllers/studentDashboardController');
const { authenticateToken, authorizeStudent } = require('../middleware/auth');

// Student Dashboard Routes

// IMPORTANT: Static routes must come BEFORE parameterized routes
// Dashboard routes
// GET /api/student/dashboard/stats - Get dashboard statistics
console.log('Registering route: GET /dashboard/stats');
router.get('/dashboard/stats', authenticateToken, authorizeStudent, getStudentDashboardStats);

// GET /api/student/dashboard/activity - Get recent activity
router.get('/dashboard/activity', authenticateToken, authorizeStudent, getStudentRecentActivity);

// Assignment routes removed - assignments feature disabled

// Attendance routes
// GET /api/student/attendance - Get student attendance
router.get('/attendance', authenticateToken, authorizeStudent, getMyAttendance);

// GET /api/student/attendance/summary - Get attendance summary
router.get('/attendance/summary', authenticateToken, authorizeStudent, getAttendanceSummary);

// GET /api/student/attendance/subject/:subjectId - Get attendance by subject
router.get('/attendance/subject/:subjectId', authenticateToken, authorizeStudent, getAttendanceBySubject);

// Materials routes
// GET /api/student/materials - Get student materials
router.get('/materials', authenticateToken, authorizeStudent, getMyMaterials);

// GET /api/student/materials/:materialId - Get material by ID
router.get('/materials/:materialId', authenticateToken, authorizeStudent, getMaterialById);

// GET /api/student/materials/:materialId/download - Download material
router.get('/materials/:materialId/download', authenticateToken, authorizeStudent, downloadMaterial);

// Results routes
// GET /api/student/results - Get student results
router.get('/results', authenticateToken, authorizeStudent, getMyResults);

// GET /api/student/results/:resultId - Get result by ID
router.get('/results/:resultId', authenticateToken, authorizeStudent, getResultById);

// GET /api/student/results/performance/summary - Get performance summary
router.get('/results/performance/summary', authenticateToken, authorizeStudent, getPerformanceSummary);

// Communication routes
// GET /api/student/communications - Get student communications
router.get('/communications', authenticateToken, authorizeStudent, getMyCommunications);

// POST /api/student/communications - Ask doubt
router.post('/communications', authenticateToken, authorizeStudent, askDoubt);

// GET /api/student/communications/:communicationId - Get communication by ID
router.get('/communications/:communicationId', authenticateToken, authorizeStudent, getCommunicationById);

// GET /api/student/communications/stats - Get communication statistics
router.get('/communications/stats', authenticateToken, authorizeStudent, getCommunicationStats);

module.exports = router;
