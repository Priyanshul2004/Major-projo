const express = require('express');
const router = express.Router();
const {
  getExamResultsBySubject,
  getExamResultsSummary,
  getStudentPerformanceBySubject,
  getTopPerformers,
  getSubjectWiseStatistics
} = require('../controllers/examResultsController');

// Exam Results Routes

// GET /api/exam-results/subjects - Get exam results grouped by subject (main HOD view)
router.get('/subjects', getExamResultsBySubject);

// GET /api/exam-results/summary - Get overall exam results summary
router.get('/summary', getExamResultsSummary);

// GET /api/exam-results/student/:studentId - Get student performance by subject
router.get('/student/:studentId', getStudentPerformanceBySubject);

// GET /api/exam-results/top-performers - Get top performing students
router.get('/top-performers', getTopPerformers);

// GET /api/exam-results/subject-statistics - Get subject-wise statistics
router.get('/subject-statistics', getSubjectWiseStatistics);

module.exports = router;
