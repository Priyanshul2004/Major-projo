const express = require('express');
const router = express.Router();

const {
  getStudentResults,
  getStudentResultsBySubject,
  getExamResultById,
  getStudentPerformanceSummary,
  getResultsByExamType,
  getStudentResultsCard
} = require('../controllers/studentResultsController');

// Routes

// GET /api/student/:studentId/results - Get student's exam results
router.get('/:studentId/results', getStudentResults);

// GET /api/student/:studentId/results/subject/:subjectId - Get student's results by subject
router.get('/:studentId/results/subject/:subjectId', getStudentResultsBySubject);

// GET /api/student/:studentId/results/card - Get student results data in card format (MUST come before /:examResultId)
router.get('/:studentId/results/card', getStudentResultsCard);

// GET /api/student/:studentId/results/performance/summary - Get student's performance summary
router.get('/:studentId/results/performance/summary', getStudentPerformanceSummary);

// GET /api/student/:studentId/results/exam-type/:examType - Get results by exam type
router.get('/:studentId/results/exam-type/:examType', getResultsByExamType);

// GET /api/student/:studentId/results/:examResultId - Get single exam result (MUST come after specific routes)
router.get('/:studentId/results/:examResultId', getExamResultById);

module.exports = router;
