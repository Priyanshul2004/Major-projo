const express = require('express');
const router = express.Router();
const {
  getStudentAttendanceForProfessor,
  getAttendanceSummaryForProfessor,
  getProfessorSubjects,
  getStudentsForAttendance,
  saveStudentAttendance
} = require('../controllers/professorAttendanceController');
const { authenticateToken, authorizeProfessor } = require('../middleware/auth');

// Professor Attendance Management Routes

// Test route to verify this router is working
router.get('/test-attendance', (req, res) => {
  console.log('=== PROFESSOR ATTENDANCE ROUTER IS WORKING ===');
  res.json({ success: true, message: 'Professor attendance router is working' });
});

// GET /api/professor/:professorId/attendance/students - Get student attendance for professor
router.get('/:professorId/attendance/students', authenticateToken, authorizeProfessor, (req, res, next) => {
  console.log('=== ATTENDANCE ROUTE HIT: /:professorId/attendance/students ===');
  console.log('Professor ID from route:', req.params.professorId);
  next();
}, getStudentAttendanceForProfessor);

// GET /api/professor/:professorId/attendance/summary - Get attendance summary for professor
router.get('/:professorId/attendance/summary', authenticateToken, authorizeProfessor, (req, res, next) => {
  console.log('=== ATTENDANCE ROUTE HIT: /:professorId/attendance/summary ===');
  console.log('Professor ID from route:', req.params.professorId);
  next();
}, getAttendanceSummaryForProfessor);

// GET /api/professor/:professorId/attendance/subjects - Get subjects taught by professor
router.get('/:professorId/attendance/subjects', authenticateToken, authorizeProfessor, (req, res, next) => {
  console.log('=== ATTENDANCE ROUTE HIT: /:professorId/attendance/subjects ===');
  console.log('Professor ID from route:', req.params.professorId);
  next();
}, getProfessorSubjects);

// GET /api/professor/:professorId/attendance/students/list - Get students for attendance taking
router.get('/:professorId/attendance/students/list', authenticateToken, authorizeProfessor, (req, res, next) => {
  console.log('=== ATTENDANCE ROUTE HIT: /:professorId/attendance/students/list ===');
  console.log('Professor ID from route:', req.params.professorId);
  next();
}, getStudentsForAttendance);

// POST /api/professor/:professorId/attendance/students/mark - Save student attendance
router.post('/:professorId/attendance/students/mark', authenticateToken, authorizeProfessor, (req, res, next) => {
  console.log('=== ATTENDANCE ROUTE HIT: /:professorId/attendance/students/mark ===');
  console.log('Professor ID from route:', req.params.professorId);
  console.log('Request body:', req.body);
  next();
}, saveStudentAttendance);

module.exports = router;
