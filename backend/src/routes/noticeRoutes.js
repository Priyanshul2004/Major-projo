const express = require('express');
const router = express.Router();
const {
  getAllNotices,
  createNotice
} = require('../controllers/noticeController');

// Notice Management Routes

// GET /api/notices - Get all notices
router.get('/', getAllNotices);

// POST /api/notices - Create new notice
router.post('/', createNotice);

module.exports = router;
