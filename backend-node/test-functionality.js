const mongoose = require('mongoose');
const OTP = require('./models/OTP');
const User = require('./models/User');
const { sendOTPEmail, generateOTP } = require('./utils/email');
require('dotenv').config();

async function testFunctionality() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME
    });
    console.log('✅ Connected to MongoDB');

    // Test 1: Check if OTPs are being stored
    console.log('\n🔍 Checking OTPs in database...');
    const otps = await OTP.find({}).sort({ createdAt: -1 }).limit(5);
    console.log(`Found ${otps.length} OTPs in database:`);
    otps.forEach(otp => {
      console.log(`- Email: ${otp.email}, OTP: ${otp.otp}, Created: ${otp.createdAt}`);
    });

    // Test 2: Check users
    console.log('\n👥 Checking users in database...');
    const users = await User.find({}).sort({ createdAt: -1 }).limit(5);
    console.log(`Found ${users.length} users in database:`);
    users.forEach(user => {
      console.log(`- Name: ${user.name}, Email: ${user.email}, Verified: ${user.isVerified}`);
    });

    // Test 3: Test email functionality
    console.log('\n📧 Testing email functionality...');
    const testOTP = generateOTP();
    console.log(`Generated OTP: ${testOTP}`);
    
    try {
      const emailSent = await sendOTPEmail('officialharsharora2812@gmail.com', testOTP, 'Test User');
      console.log(`Email sent: ${emailSent ? '✅ SUCCESS' : '❌ FAILED'}`);
    } catch (error) {
      console.log(`❌ Email error: ${error.message}`);
    }

    // Test 4: Check environment variables
    console.log('\n🔧 Environment Variables Check:');
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ Missing'}`);
    console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing'}`);
    console.log(`MONGO_URL: ${process.env.MONGO_URL ? '✅ Set' : '❌ Missing'}`);
    console.log(`GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing'}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

testFunctionality();
