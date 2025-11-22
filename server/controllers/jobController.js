// server/controllers/jobController.js
const Job = require('../models/Job');
const User = require('../models/User'); // We need this
const axios = require('axios');

// ---
// Helper function to call the ML API (NEW VERSION)
// ---
const getPrediction = async (jobData, userData) => {
  try {
    // 1. Prepare features for the model
    // We combine data from the job and the user
    const featureData = {
      // From userData (req.user)
      age: userData.age || 0,
      gender: userData.gender || 0,
      educationLevel: userData.educationLevel || 0,
      experience: userData.yearsOfExperience || 0, // App sends 'experience'
      
      // From jobData (req.body)
      previousCompanies: jobData.previousCompanies || 0,
      distanceFromCompany: jobData.distanceFromCompany || 0,
    };

    console.log('Sending 6 features to ML API:', featureData);

    // 2. Call the Flask API
    const response = await axios.post(
      `${process.env.ML_API_URL}/api/ml/predict`,
      featureData
    );

    // 3. Return the probability
    return response.data.offer_probability;
  } catch (error) {
    console.error('Error fetching prediction from ML service:', error.message);
    return null; // Return null if ML service fails
  }
};

// @desc    Create a new job (UPDATED)
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
  // Get ALL fields from the body
  const { 
    company, title, salaryExpectation, status, dateApplied,
    previousCompanies, distanceFromCompany 
  } = req.body;
  
  try {
    // Get the user's data from req.user (attached by auth middleware)
    // Note: req.user won't have the new fields until they re-login or
    // we update our auth.js. For now, we can fetch them.
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Call our ML helper with job data and user data
    const probability = await getPrediction(req.body, user);

    const job = new Job({
      user: req.user.id,
      company,
      title,
      status,
      salaryExpectation,
      dateApplied,
      previousCompanies, // Save new field
      distanceFromCompany, // Save new field
      predictedProbability: probability,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job (UPDATED)
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  // Get all fields
  const { 
    company, title, status, salaryExpectation, followUps, dateApplied,
    previousCompanies, distanceFromCompany 
  } = req.body;

  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    
    // Get user data
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update the fields
    job.company = company || job.company;
    job.title = title || job.title;
    job.status = status || job.status;
    job.salaryExpectation = salaryExpectation || job.salaryExpectation;
    job.followUps = followUps !== undefined ? followUps : job.followUps;
    job.dateApplied = dateApplied || job.dateApplied;
    job.previousCompanies = previousCompanies !== undefined ? previousCompanies : job.previousCompanies;
    job.distanceFromCompany = distanceFromCompany !== undefined ? distanceFromCompany : job.distanceFromCompany;

    // --- Recalculate Prediction ---
    const probability = await getPrediction(job, user);
    job.predictedProbability = probability;
    // ---
    
    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... (getJobs, getJobById, and deleteJob are unchanged) ...

exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user.id }).sort({ dateApplied: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });
        if (job.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        await job.remove();
        res.json({ msg: 'Job removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};