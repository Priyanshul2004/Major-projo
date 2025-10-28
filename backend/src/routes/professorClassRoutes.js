const express = require('express');
const router = express.Router();
const {
  getStudentsInClass,
  getStudentById,
  addStudentToClass,
  removeStudentFromClass,
  getProfessorSubjects,
  updateStudentInfo
} = require('../controllers/professorClassController');

// Professor Class Management Routes

// GET /api/professor/:professorId/class/students - Get all students in professor's class
router.get('/:professorId/class/students', (req, res, next) => {
  console.log('=== CLASS ROUTE HIT: /:professorId/class/students ===');
  console.log('Professor ID from route:', req.params.professorId);
  next();
}, getStudentsInClass);

// GET /api/professor/:professorId/class/students/:studentId - Get specific student by ID
router.get('/:professorId/class/students/:studentId', getStudentById);

// POST /api/professor/:professorId/class/students - Add new student to class
router.post('/:professorId/class/students', (req, res, next) => {
  console.log('=== POST CLASS ROUTE HIT: /:professorId/class/students ===');
  console.log('Professor ID from route:', req.params.professorId);
  console.log('Request body:', req.body);
  next();
}, addStudentToClass);

// DELETE /api/professor/:professorId/class/students/:studentId - Remove student from class
router.delete('/:professorId/class/students/:studentId', removeStudentFromClass);

// PUT /api/professor/:professorId/class/students/:studentId - Update student information
router.put('/:professorId/class/students/:studentId', updateStudentInfo);

// GET /api/professor/:professorId/subjects - Get professor's subjects (for adding students)
router.get('/:professorId/subjects', getProfessorSubjects);

module.exports = router;
