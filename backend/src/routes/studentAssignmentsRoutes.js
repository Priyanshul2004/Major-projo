const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  getStudentAssignments,
  getAssignmentById,
  submitAssignment,
  updateAssignmentSubmission,
  downloadAssignmentFile,
  getStudentAssignmentStats
} = require('../controllers/studentAssignmentsController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/assignments/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.zip', '.rar'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, ZIP, and RAR files are allowed.'));
    }
  }
});

// Routes

// GET /api/student/:studentId/assignments - Get student's assignments
router.get('/:studentId/assignments', getStudentAssignments);

// GET /api/student/:studentId/assignments/:assignmentId - Get single assignment details
router.get('/:studentId/assignments/:assignmentId', getAssignmentById);

// POST /api/student/:studentId/assignments/:assignmentId/submit - Submit assignment
router.post('/:studentId/assignments/:assignmentId/submit', upload.single('file'), submitAssignment);

// PUT /api/student/:studentId/assignments/:assignmentId/submit - Update assignment submission
router.put('/:studentId/assignments/:assignmentId/submit', upload.single('file'), updateAssignmentSubmission);

// GET /api/student/:studentId/assignments/:assignmentId/download - Download assignment file
router.get('/:studentId/assignments/:assignmentId/download', downloadAssignmentFile);

// GET /api/student/:studentId/assignments/stats - Get student's assignment statistics
router.get('/:studentId/assignments/stats', getStudentAssignmentStats);

module.exports = router;
