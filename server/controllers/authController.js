// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to sign a token (unchanged)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user (UPDATED)
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  // Get ALL the new fields from the request
  const { 
    name, email, password, 
    yearsOfExperience, age, gender, educationLevel 
  } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with ALL fields
    const user = await User.create({
      name,
      email,
      password,
      yearsOfExperience,
      age,
      gender,
      educationLevel
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        yearsOfExperience: user.yearsOfExperience,
        age: user.age,
        gender: user.gender,
        educationLevel: user.educationLevel,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... (loginUser and getUserProfile are unchanged for now) ...
// (Note: You should update loginUser and getUserProfile to return
// the new fields as well, so req.user is always up to date)

// @desc    Auth user & get token (Login)
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password, "ep")
  try {
    const user = await User.findOne({ email });
    console.log("user", user)
    console.log()
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        yearsOfExperience: user.yearsOfExperience,
        age: user.age,
        gender: user.gender,
        educationLevel: user.educationLevel,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
exports.getUserProfile = async (req, res) => {
  if (req.user) {
    // req.user is set by authMiddleware, but it might be stale.
    // Let's fetch the latest user data.
    const user = await User.findById(req.user.id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        yearsOfExperience: user.yearsOfExperience,
        age: user.age,
        gender: user.gender,
        educationLevel: user.educationLevel,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};