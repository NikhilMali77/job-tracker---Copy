// server/controllers/statsController.js
const Job = require('../models/Job');
const mongoose = require('mongoose');

// @desc    Get dashboard stats
// @route   GET /api/stats
exports.getStats = async (req, res) => {
  try {
    // 1. Get total jobs by status (for Pie/Bar chart)
    const stats = await Job.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusStats = stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {
      Applied: 0,
      Interviewing: 0,
      Offer: 0,
      Rejected: 0,
    });

    // 2. Get applications per month (for Line chart)
    const monthlyApplications = await Job.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: {
            year: { $year: '$dateApplied' },
            month: { $month: '$dateApplied' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }, // Get last 12 months
    ]);

    // Format for Chart.js
    const formattedMonthly = monthlyApplications.map(item => ({
      date: `${item._id.month}/${item._id.year}`,
      count: item.count,
    }));
    
    res.json({
      statusStats,
      monthlyApplications: formattedMonthly,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};