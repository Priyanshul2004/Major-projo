const express = require('express');
const router = express.Router();

const {
  getStudentCommunications,
  getCommunicationById,
  askDoubt,
  updateCommunication,
  deleteCommunication,
  getCommunicationsBySubject,
  getRecentCommunications,
  getCommunicationStats
} = require('../controllers/studentCommunicationController');

// Routes

// GET /api/student/:studentId/communications - Get student's communication history
router.get('/:studentId/communications', getStudentCommunications);

// GET /api/student/:studentId/communications/:id - Get single communication
router.get('/:studentId/communications/:id', getCommunicationById);

// POST /api/student/:studentId/communications - Ask a new doubt/question
router.post('/:studentId/communications', askDoubt);

// PUT /api/student/:studentId/communications/:id - Update communication
router.put('/:studentId/communications/:id', updateCommunication);

// DELETE /api/student/:studentId/communications/:id - Delete communication
router.delete('/:studentId/communications/:id', deleteCommunication);

// GET /api/student/:studentId/communications/subject/:subject - Get communications by subject
router.get('/:studentId/communications/subject/:subject', getCommunicationsBySubject);

// GET /api/student/:studentId/communications/recent - Get recent communications
router.get('/:studentId/communications/recent', getRecentCommunications);

// GET /api/student/:studentId/communications/stats - Get communication statistics
router.get('/:studentId/communications/stats', getCommunicationStats);

module.exports = router;
