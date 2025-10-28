const express = require('express');
const router = express.Router();

const {
  getProfessorExamResults,
  getExamResultById,
  createStudentResult,
  createExamResult,
  updateExamResult,
  deleteExamResult,
  addStudentResult,
  updateStudentResult,
  deleteStudentResult,
  publishExamResults,
  bulkUploadResults
} = require('../controllers/professorResultsController');

// Routes

// GET /api/professor/:professorId/results - Get all exam results for a professor
router.get('/:professorId/results', (req, res, next) => {
  console.log('=== RESULTS ROUTE HIT: /:professorId/results ===');
  console.log('Professor ID from route:', req.params.professorId);
  next();
}, getProfessorExamResults);

// GET /api/professor/results/:id - Get single exam result
router.get('/results/:id', getExamResultById);

// POST /api/professor/:professorId/results/student - Create simple student result
router.post('/:professorId/results/student', createStudentResult);

// POST /api/professor/:professorId/results - Create new exam result
router.post('/:professorId/results', createExamResult);

// PUT /api/professor/results/:id - Update exam result
router.put('/results/:id', updateExamResult);

// DELETE /api/professor/results/:id - Delete exam result
router.delete('/results/:id', deleteExamResult);

// POST /api/professor/results/:examResultId/students - Add student result
router.post('/results/:examResultId/students', addStudentResult);

// PUT /api/professor/results/:examResultId/students/:resultId - Update student result
router.put('/results/:examResultId/students/:resultId', updateStudentResult);

// DELETE /api/professor/results/:examResultId/students/:resultId - Delete student result
router.delete('/results/:examResultId/students/:resultId', deleteStudentResult);

// PATCH /api/professor/results/:id/publish - Publish exam results
router.patch('/results/:id/publish', publishExamResults);

// POST /api/professor/results/:examResultId/bulk-upload - Bulk upload results
router.post('/results/:examResultId/bulk-upload', bulkUploadResults);

module.exports = router;
