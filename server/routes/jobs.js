// server/routes/jobs.js
const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  getJobById, // Make sure to import this
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// All these routes are protected. You must be logged in.
// router.route('/') handles GET and POST on the base /api/jobs
router.route('/').get(protect, getJobs).post(protect, createJob);

// router.route('/:id') handles GET, PUT, DELETE on /api/jobs/:id
router
  .route('/:id')
  .get(protect, getJobById) // <-- The added line
  .put(protect, updateJob)
  .delete(protect, deleteJob);

module.exports = router;