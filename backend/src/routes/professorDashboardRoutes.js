const express = require('express');
const router = express.Router();
const {
  getProfessorDashboardStats,
  getProfessorRecentActivity,
  getProfessorProfileSummary,
  getMyStudents,
  addStudent,
  getStudentAttendance,
  getAttendanceSummary,
  getProfessorSubjects
} = require('../controllers/professorDashboardController');
const { authenticateToken, authorizeProfessor } = require('../middleware/auth');

// Professor Dashboard Routes

// IMPORTANT: Static routes must come BEFORE parameterized routes
// Dashboard routes - Simplified following HOD pattern
// GET /api/professor/dashboard/stats - Get dashboard statistics
router.get('/dashboard/stats', authenticateToken, authorizeProfessor, getProfessorDashboardStats);

// GET /api/professor/dashboard/activity - Get recent activity
router.get('/dashboard/activity', authenticateToken, authorizeProfessor, getProfessorRecentActivity);

// Simplified routes following HOD pattern
// GET /api/professor/students - Get professor's students
router.get('/students', authenticateToken, authorizeProfessor, getMyStudents);

// POST /api/professor/students - Add new student
router.post('/students', authenticateToken, authorizeProfessor, addStudent);

// Attendance routes - Simplified
// GET /api/professor/attendance/students - Get student attendance
router.get('/attendance/students', authenticateToken, authorizeProfessor, getStudentAttendance);

// GET /api/professor/attendance/summary - Get attendance summary
router.get('/attendance/summary', authenticateToken, authorizeProfessor, getAttendanceSummary);

// GET /api/professor/attendance/subjects - Get professor subjects
router.get('/attendance/subjects', authenticateToken, authorizeProfessor, getProfessorSubjects);

// Test route to verify this router is working
router.get('/test', (req, res) => {
  console.log('=== PROFESSOR DASHBOARD ROUTER IS WORKING ===');
  res.json({ success: true, message: 'Professor dashboard router is working' });
});

// Test route with professor ID
router.get('/:professorId/test', (req, res) => {
  console.log('=== PROFESSOR DASHBOARD TEST WITH ID ===');
  console.log('Professor ID:', req.params.professorId);
  res.json({ 
    success: true, 
    message: 'Professor dashboard router is working with ID',
    professorId: req.params.professorId
  });
});

// GET /api/professor/:professorId/dashboard/stats - Get dashboard statistics (top cards)
router.get('/:professorId/dashboard/stats', (req, res, next) => {
  console.log('=== ROUTE HIT: /:professorId/dashboard/stats ===');
  console.log('Professor ID from route:', req.params.professorId);
  next();
}, getProfessorDashboardStats);

// GET /api/professor/:professorId/dashboard/activity - Get recent activity
router.get('/:professorId/dashboard/activity', getProfessorRecentActivity);

// GET /api/professor/:professorId/dashboard/profile - Get professor profile summary
router.get('/:professorId/dashboard/profile', getProfessorProfileSummary);

module.exports = router;
