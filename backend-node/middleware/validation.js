const { body } = require('express-validator');

// Registration validation
const validateRegistration = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// OTP verification validation
const validateOTPVerification = [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('password').isLength({ min: 6 })
];

// Login validation
const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

// Chat validation
const validateChat = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters')
    .escape(), // Sanitize input
  body('session_id')
    .optional()
    .isUUID()
    .withMessage('Session ID must be a valid UUID')
];

// Resend OTP validation
const validateResendOTP = [
  body('email').isEmail().normalizeEmail()
];

module.exports = {
  validateRegistration,
  validateOTPVerification,
  validateLogin,
  validateChat,
  validateResendOTP
};
