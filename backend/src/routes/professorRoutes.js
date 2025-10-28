const express = require('express');
const router = express.Router();
const {
  createProfessor,
  getAllProfessors,
  getProfessorById,
  updateProfessor,
  deleteProfessor
} = require('../controllers/professorController');

// Professor Management Routes

// POST /api/professors - Create new professor
router.post('/', createProfessor);

// GET /api/professors - Get all professors
router.get('/', getAllProfessors);

// GET /api/professors/:id - Get single professor by ID
router.get('/:id', getProfessorById);

// PUT /api/professors/:id - Update professor
router.put('/:id', updateProfessor);

// DELETE /api/professors/:id - Delete professor
router.delete('/:id', deleteProfessor);

module.exports = router;