const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const hodRoutes = require('./hodRoutes');
const professorRoutes = require('./professorRoutes');
const professorDashboardRoutes = require('./professorDashboardRoutes');
const professorAttendanceRoutes = require('./professorAttendanceRoutes');
const professorClassRoutes = require('./professorClassRoutes');
const professorMaterialsRoutes = require('./professorMaterialsRoutes');
const professorResultsRoutes = require('./professorResultsRoutes');
const professorCommunicationRoutes = require('./professorCommunicationRoutes');
const unifiedCommunicationRoutes = require('./unifiedCommunicationRoutes');
// const studentAssignmentsRoutes = require('./studentAssignmentsRoutes');
const studentAttendanceRoutes = require('./studentAttendanceRoutes');
// const studentMaterialsRoutes = require('./studentMaterialsRoutes');
const studentResultsRoutes = require('./studentResultsRoutes');
// const studentCommunicationRoutes = require('./studentCommunicationRoutes');
const studentDashboardRoutes = require('./studentDashboardRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const examResultsRoutes = require('./examResultsRoutes');
const noticeRoutes = require('./noticeRoutes');

// Use route modules
router.use('/auth', authRoutes);
router.use('/hod', hodRoutes);
router.use('/professors', professorRoutes);
router.use('/professor', professorDashboardRoutes);
router.use('/professor', professorAttendanceRoutes);
router.use('/professor', professorClassRoutes);
router.use('/professor', professorMaterialsRoutes);
router.use('/professor', professorResultsRoutes);
router.use('/professor', professorCommunicationRoutes);
router.use('/communications', unifiedCommunicationRoutes);
router.use('/student', studentDashboardRoutes);
// router.use('/student', studentAssignmentsRoutes);
router.use('/student', studentAttendanceRoutes);
// router.use('/student', studentMaterialsRoutes);
router.use('/student', studentResultsRoutes);
// router.use('/student', studentCommunicationRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/exam-results', examResultsRoutes);
router.use('/notices', noticeRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
