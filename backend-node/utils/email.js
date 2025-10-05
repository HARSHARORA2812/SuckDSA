const transporter = require('../config/email');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '🔥 SuckDSA - Verify Your Email (OTP Inside)',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px;">
        <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #667eea; margin-bottom: 20px;">🔥 Welcome to SuckDSA!</h1>
          <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
            Arre <strong>${name}</strong>! Ready to get roasted while learning DSA? 😏
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; color: #666; margin-bottom: 10px;">Your OTP is:</p>
            <h2 style="font-size: 36px; color: #667eea; letter-spacing: 5px; margin: 10px 0;">${otp}</h2>
          </div>
          <p style="color: #666; font-size: 14px;">
            This OTP will expire in 5 minutes. Don't be slower than a government website! ⏰
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Ready to learn DSA with savage Indian analogies? Let's go! 🚀
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = { generateOTP, sendOTPEmail };
