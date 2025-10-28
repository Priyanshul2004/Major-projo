const express = require('express');
const router = express.Router();
const {
  getStudentAttendance,
  getProfessorAttendance,
  getProfessorsForAttendance,
  saveProfessorAttendance,
  getAttendanceReports
} = require('../controllers/attendanceController');
const { authenticateToken, authorizeHOD } = require('../middleware/auth');

// Attendance Management Routes

// GET /api/attendance/students - Get student attendance overview
router.get('/students', authenticateToken, authorizeHOD, getStudentAttendance);

// GET /api/attendance/professors - Get professor attendance overview
router.get('/professors', authenticateToken, authorizeHOD, getProfessorAttendance);

// GET /api/attendance/professors/list - Get professors list for marking attendance
router.get('/professors/list', authenticateToken, authorizeHOD, getProfessorsForAttendance);

// POST /api/attendance/professors/mark - Save professor attendance
router.post('/professors/mark', authenticateToken, authorizeHOD, saveProfessorAttendance);

// GET /api/attendance/reports - Get attendance reports
router.get('/reports', authenticateToken, authorizeHOD, getAttendanceReports);

module.exports = router;
