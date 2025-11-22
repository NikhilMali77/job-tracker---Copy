// server/models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: { type: String, required: true },
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ['Applied', 'Interviewing', 'Offer', 'Rejected'],
    default: 'Applied',
  },
  salaryExpectation: { type: Number }, // We still track this
  dateApplied: { type: Date, default: Date.now },
  followUps: { type: Number, default: 0 }, // We still track this
  predictedProbability: { type: Number },
  
  // --- NEW FIELDS TO SAVE ---
  previousCompanies: { type: Number, default: 0 },
  distanceFromCompany: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);