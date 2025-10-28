const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  getProfessorMaterials,
  getMaterialById,
  uploadMaterial,
  updateMaterial,
  deleteMaterial,
  downloadMaterial,
  getMaterialStatistics,
  toggleMaterialStatus
} = require('../controllers/professorMaterialsController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/uploads/materials');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
    cb(null, fileName);
  }
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, TXT, XLS, XLSX, JPG, PNG, GIF files are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Middleware to handle multer errors
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'File size too large. Maximum size is 50MB.'
        }
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Too many files. Only one file is allowed per upload.'
        }
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: {
        message: error.message
      }
    });
  }
  
  next(error);
};

// Routes

// GET /api/professor/:professorId/materials - Get all materials for a professor
router.get('/:professorId/materials', getProfessorMaterials);

// GET /api/professor/materials/:id - Get single material
router.get('/materials/:id', getMaterialById);

// POST /api/professor/:professorId/materials - Upload new material
router.post('/:professorId/materials', upload.single('file'), handleUploadError, uploadMaterial);

// PUT /api/professor/materials/:id - Update material
router.put('/materials/:id', updateMaterial);

// DELETE /api/professor/materials/:id - Delete material
router.delete('/materials/:id', deleteMaterial);

// GET /api/professor/materials/:id/download - Download material
router.get('/materials/:id/download', downloadMaterial);

// GET /api/professor/:professorId/materials/statistics - Get material statistics
router.get('/:professorId/materials/statistics', getMaterialStatistics);

// PATCH /api/professor/materials/:id/status - Toggle material status (archive/unarchive)
router.patch('/materials/:id/status', toggleMaterialStatus);

module.exports = router;
