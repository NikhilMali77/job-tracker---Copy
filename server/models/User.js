// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // --- UPDATED & NEW FIELDS ---
  yearsOfExperience: { type: Number, default: 0 },
  age: { type: Number, default: 0 },
  gender: { type: Number, default: 0 }, // 0=Female, 1=Male
  educationLevel: { type: Number, default: 0 }, // 1=High School, 2=Bachelor's, etc.
});

// ... (your 'pre' and 'matchPassword' methods are unchanged) ...
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);