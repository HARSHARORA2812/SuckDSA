const express = require('express');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { authenticateToken } = require('../middleware/auth');
const { 
  validateRegistration, 
  validateOTPVerification, 
  validateLogin, 
  validateResendOTP 
} = require('../middleware/validation');
const { generateToken } = require('../utils/jwt');
const { generateOTP, sendOTPEmail } = require('../utils/email');

const router = express.Router();


// Register User
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Arre yaar! Form bharne mein bhi galti kar rahe ho? Fix these errors:",
        details: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered hai! Login kar ya bhool gaye password? 🤔"
      });
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Save OTP to database
    await OTP.findOneAndDelete({ email }); // Remove any existing OTP
    const otpDoc = new OTP({ email, otp });
    await otpDoc.save();

    // Send OTP email with error handling
    try {
      await sendOTPEmail(email, otp, name);
      console.log(`OTP sent successfully to ${email}`);
    } catch (error) {
      console.error('Email service error:', error.message);
      console.log(`DEBUG: OTP for ${email} is: ${otp}`);
      // Continue anyway - user can get OTP from logs if needed
    }

    res.status(200).json({
      message: "OTP sent to your email! Check inbox and verify karo 📧",
      email: email,
      nextStep: "verify-otp"
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: "Registration mein problem hai! Server ka mood off hai 😅"
    });
  }
});

// Verify OTP and Complete Registration
router.post('/verify-otp', validateOTPVerification, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Invalid data! Check your inputs 🤦‍♂️",
        details: errors.array()
      });
    }

    const { email, otp, name, password } = req.body;

    // Find OTP
    const otpDoc = await OTP.findOne({ email, otp });
    if (!otpDoc) {
      return res.status(400).json({
        error: "Invalid OTP! Galat code daal rahe ho ya expired ho gaya? 🕐"
      });
    }

    // Create user
    const user = new User({ name, email, password, isVerified: true });
    await user.save();

    // Delete OTP
    await OTP.findOneAndDelete({ email, otp });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Registration successful! Welcome to SuckDSA family! 🎉",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      error: "Verification failed! Try again 😓"
    });
  }
});

// Login User
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Login details galat hain! Check kar ke daal 🔍",
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "Email not found! Register kar pehle, phir login kar 📝"
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Password galat hai! Bhool gaye kya? 🤔"
      });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(401).json({
        error: "Email verify nahi kiya! OTP check kar inbox mein 📧"
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful! Ready to get roasted? 🔥",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: "Login mein problem! Server ka mood off hai 😅"
    });
  }
});

// Get Current User
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isVerified: req.user.isVerified,
      createdAt: req.user.createdAt,
      lastLogin: req.user.lastLogin
    }
  });
});

// Resend OTP
router.post('/resend-otp', validateResendOTP, async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists but not verified
    const user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({
        error: "Already verified hai! Login kar le 😊"
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    
    // Save OTP to database
    await OTP.findOneAndDelete({ email }); // Remove any existing OTP
    const otpDoc = new OTP({ email, otp });
    await otpDoc.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, 'User');
    if (!emailSent) {
      return res.status(500).json({
        error: "Email bhejne mein problem! Try again 📧"
      });
    }

    res.json({
      message: "New OTP sent! Check your inbox 📧"
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      error: "OTP resend failed! Try again 😓"
    });
  }
});

module.exports = router;
