const express = require('express');
const router = express.Router();

const {
  getAllStudentDoubts,
  getCommunicationStatistics,
  replyToStudentDoubt
} = require('../controllers/unifiedCommunicationController');

// Routes for unified communication system

// GET /api/communications/all - Get ALL student doubts/questions (for all professors and students)
router.get('/all', (req, res, next) => {
  console.log('=== UNIFIED COMMUNICATIONS ROUTE HIT: /communications/all ===');
  console.log('Query params:', req.query);
  next();
}, getAllStudentDoubts);

// GET /api/communications/statistics - Get communication statistics
router.get('/statistics', (req, res, next) => {
  console.log('=== UNIFIED COMMUNICATION STATISTICS ROUTE HIT ===');
  next();
}, getCommunicationStatistics);

// POST /api/communications/:id/reply - Reply to student doubt (any professor can reply)
router.post('/:id/reply', (req, res, next) => {
  console.log('=== UNIFIED REPLY ROUTE HIT ===');
  console.log('Communication ID:', req.params.id);
  console.log('Request body:', req.body);
  next();
}, replyToStudentDoubt);

module.exports = router;
