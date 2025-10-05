const mongoose = require('mongoose');

// OTP Schema
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, default: Date.now, expires: 300 }, // 5 minutes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OTP', otpSchema);
