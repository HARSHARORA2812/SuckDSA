const nodemailer = require('nodemailer');

// Email configuration with better error handling
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter verification failed:', error.message);
    console.log('💡 Email troubleshooting tips:');
    console.log('1. Check if EMAIL_USER and EMAIL_PASS are set correctly');
    console.log('2. Enable 2FA on Gmail and use App Password');
    console.log('3. Make sure "Less secure app access" is enabled (if not using App Password)');
  } else {
    console.log('✅ Email transporter is ready to send emails');
  }
});

module.exports = transporter;
