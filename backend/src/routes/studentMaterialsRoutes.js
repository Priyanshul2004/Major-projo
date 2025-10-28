const express = require('express');
const router = express.Router();

const {
  getStudentMaterials,
  getMaterialById,
  downloadMaterial,
  getMaterialsBySubject,
  getMaterialsByType,
  getRecentMaterials
} = require('../controllers/studentMaterialsController');

// Routes

// GET /api/student/:studentId/materials - Get student's available materials
router.get('/:studentId/materials', getStudentMaterials);

// GET /api/student/:studentId/materials/:id - Get single material details
router.get('/:studentId/materials/:id', getMaterialById);

// GET /api/student/:studentId/materials/:id/download - Download material
router.get('/:studentId/materials/:id/download', downloadMaterial);

// GET /api/student/:studentId/materials/subject/:subjectId - Get materials by subject
router.get('/:studentId/materials/subject/:subjectId', getMaterialsBySubject);

// GET /api/student/:studentId/materials/type/:type - Get materials by type
router.get('/:studentId/materials/type/:type', getMaterialsByType);

// GET /api/student/:studentId/materials/recent - Get recent materials
router.get('/:studentId/materials/recent', getRecentMaterials);

module.exports = router;
