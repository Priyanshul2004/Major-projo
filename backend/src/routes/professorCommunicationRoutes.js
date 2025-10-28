const express = require('express');
const router = express.Router();

const {
  getProfessorCommunications,
  getCommunicationById,
  replyToCommunication,
  updateCommunicationReply,
  deleteCommunication,
  getCommunicationsBySubject,
  getRecentCommunications,
  getCommunicationStatistics
} = require('../controllers/professorCommunicationController');

// Routes

// GET /api/professor/:professorId/communications - Get professor's communications
router.get('/:professorId/communications', (req, res, next) => {
  console.log('=== COMMUNICATIONS ROUTE HIT: /:professorId/communications ===');
  console.log('Professor ID from route:', req.params.professorId);
  next();
}, getProfessorCommunications);

// GET /api/professor/communications/:id - Get single communication
router.get('/communications/:id', getCommunicationById);

// POST /api/professor/communications/:id/reply - Reply to communication
router.post('/communications/:id/reply', replyToCommunication);

// PUT /api/professor/communications/:id/reply - Update reply
router.put('/communications/:id/reply', updateCommunicationReply);

// DELETE /api/professor/communications/:id - Delete communication
router.delete('/communications/:id', deleteCommunication);

// GET /api/professor/:professorId/communications/subject/:subject - Get communications by subject
router.get('/:professorId/communications/subject/:subject', getCommunicationsBySubject);

// GET /api/professor/:professorId/communications/recent - Get recent communications
router.get('/:professorId/communications/recent', getRecentCommunications);

// GET /api/professor/:professorId/communications/statistics - Get communication statistics
router.get('/:professorId/communications/statistics', getCommunicationStatistics);

module.exports = router;
