// server/routes/scrapeRoutes.js
const express = require('express');
const router = express.Router();
const { extractJobDetails } = require('../controllers/scrapeController');
const { protect } = require('../middleware/authMiddleware');

// This route must be protected so only logged-in users can use it
router.post('/extract-details', protect, extractJobDetails);

module.exports = router;