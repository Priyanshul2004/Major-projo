const express = require('express');
const router = express.Router();

const {
  getStudentAttendance,
  getStudentAttendanceSummary,
  getRecentAttendanceHistory,
  getAttendanceBySubject,
  getAttendanceCalendar,
  getStudentAttendanceCard
} = require('../controllers/studentAttendanceController');

// Routes

// GET /api/student/:studentId/attendance - Get student's attendance records
router.get('/:studentId/attendance', getStudentAttendance);

// GET /api/student/:studentId/attendance/summary - Get student's attendance summary
router.get('/:studentId/attendance/summary', getStudentAttendanceSummary);

// GET /api/student/:studentId/attendance/recent - Get recent attendance history
router.get('/:studentId/attendance/recent', getRecentAttendanceHistory);

// GET /api/student/:studentId/attendance/subject/:subjectId - Get attendance by subject
router.get('/:studentId/attendance/subject/:subjectId', getAttendanceBySubject);

// GET /api/student/:studentId/attendance/calendar - Get attendance calendar view
router.get('/:studentId/attendance/calendar', getAttendanceCalendar);

// GET /api/student/:studentId/attendance/card - Get student attendance data in card format
router.get('/:studentId/attendance/card', getStudentAttendanceCard);

module.exports = router;
