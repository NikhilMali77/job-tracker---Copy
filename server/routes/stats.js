// server/routes/stats.js
const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/stats
router.route('/').get(protect, getStats);

module.exports = router;