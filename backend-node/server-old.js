const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Arre yaar! Too many requests from your IP. Take a chai break and try again later! ☕"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat-specific rate limiting (more restrictive)
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 chat requests per minute
  message: {
    error: "Slow down, speed racer! Even the savage teacher needs time to think. Wait a minute! 🐌"
  }
});

// CORS Configuration for Production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://suckdsa.vercel.app',
      /\.vercel\.app$/,
      /\.netlify\.app$/
    ];
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      }
      return allowedOrigin.test(origin);
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('combined')); // Request logging
app.use(limiter); // Apply rate limiting to all requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🚀 Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Initialize Google Gemini
const GEMINI_API_KEY = "AIzaSyC_SE19_M302kzhfkQs51GyKDjFUK_Bdzk";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Savage DSA System Prompt
const SAVAGE_SYSTEM_PROMPT = `
You are SuckDSA, the most brutally savage DSA teacher on the planet for Indian learners.

Your personality:
- Savage, witty, and brutally honest but never offensive to religion/caste/politics
- Use Indian masala - Bollywood references, cricket analogies, chai-samosa comparisons, "aunty-uncle" logic
- Educational at core - technically correct explanations simplified for beginners
- Roast examples: "chappal-level coder," "brain = Windows XP," "Laddu with zero compression"

Response Style:
1. Start with a roast → slap them awake
2. Give a desi analogy → Bollywood, cricket, daily life
3. Deliver clear DSA explanation → super simple, memorable
4. End with savage one-liner → make them laugh and remember

Keep responses under 200 words. Be savage but educational.
`;

// MongoDB Schema
const chatMessageSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  session_id: { type: String, required: true },
  message: { type: String, required: true },
  response: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// OTP Schema
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, default: Date.now, expires: 300 }, // 5 minutes
  createdAt: { type: Date, default: Date.now }
});

const OTP = mongoose.model('OTP', otpSchema);

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// JWT Helper Functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'suckdsa-savage-secret', {
    expiresIn: '7d'
  });
};

// Auth Middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: "Arre yaar! Token nahi mila. Login kar pehle, phir savage teacher se baat kar! 🔐" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'suckdsa-savage-secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        error: "User not found. Kya bhai, ghost ban gaye ho? 👻" 
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({ 
        error: "Email verify kar pehle, phir DSA seekhne aa! OTP check kar apne inbox mein 📧" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: "Invalid token. Phir se login kar, token expired ho gaya! ⏰" 
    });
  }
};

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

// Fallback response function when Gemini API is unavailable
function getFallbackResponse(message) {
  const messageLower = message.toLowerCase();
  
  // Basic topic responses
  if (messageLower.includes('array')) {
    return "Arre yaar! Arrays are like your hostel mess plates - all lined up in a row, numbered 0 to n-1. You can grab any plate instantly by its position, but shifting plates around? That's like rearranging the entire mess queue - O(n) headache! 🍽️\n\nBasic operations:\n- Access: O(1) - instant like Maggi\n- Insert/Delete: O(n) - slow like BSNL internet\n\nRemember: Arrays are fixed size, like your brain capacity! 😏";
  }
  
  if (messageLower.includes('stack')) {
    return "Stacks? Bhai, it's like your mom's paratha pile! Last paratha goes on top, first one you eat is also from the top - LIFO (Last In, First Out)! 🥞\n\nOperations:\n- Push: Add paratha on top - O(1)\n- Pop: Take paratha from top - O(1)\n- Peek: Check top paratha without eating - O(1)\n\nUse cases: Function calls, undo operations, browser history. Simple as chai-biscuit! ☕";
  }
  
  if (messageLower.includes('linked list')) {
    return "Linked Lists = Train compartments! Each compartment (node) has passengers (data) and is connected to the next one. But unlike trains, you can't jump to any compartment directly - you have to walk from the engine! 🚂\n\nTypes:\n- Singly: One-way connection (like your ex's contact)\n- Doubly: Two-way connection (like good friendship)\n- Circular: Last connects to first (like your daily routine!)\n\nPros: Dynamic size, easy insertion\nCons: No random access, extra memory for pointers";
  }
  
  if (messageLower.includes('queue')) {
    return "Queue = Railway ticket counter line! First person in line gets ticket first - FIFO (First In, First Out). No cutting allowed, unlike real Indian queues! 🚂\n\nOperations:\n- Enqueue: Join the line (rear)\n- Dequeue: Get served (front)\n- Front: Check who's first\n- Rear: Check who's last\n\nAll operations O(1) - faster than actual ticket booking! Use in BFS, scheduling, handling requests.";
  }
  
  // Default fallback
  return "Arre yaar! The savage teacher's internet is acting like BSNL today! 😅 But here's the deal - DSA is all about understanding patterns and problem-solving. Whatever you asked about, remember: practice makes perfect, and every algorithm has its time and place. Keep coding, keep learning, and don't let temporary setbacks stop you from becoming a coding champion! 🔥\n\n(Try asking again in a moment - the teacher will be back with full savage mode!)";
}

// DSA Topics Data
const DSA_TOPICS = [
  {
    name: "Arrays",
    description: "Basic data structure to store elements",
    savage_intro: "Arrays: Not your cricket team lineup, but close enough",
    difficulty: "Beginner",
    icon: "📊"
  },
  {
    name: "Stacks",
    description: "LIFO data structure",
    savage_intro: "Stacks: Like your mom's paratha pile - last in, first out",
    difficulty: "Beginner",
    icon: "📚"
  },
  {
    name: "Trees",
    description: "Hierarchical data structure",
    savage_intro: "Trees: Not the ones outside, idiot. These grow upside down",
    difficulty: "Intermediate",
    icon: "🌳"
  },
  {
    name: "Graphs",
    description: "Connected nodes and edges",
    savage_intro: "Graphs: Like your social network, but actually useful",
    difficulty: "Advanced",
    icon: "🕸️"
  },

];

// Authentication Routes

// Register User
app.post('/api/auth/register', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
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

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, name);
    if (!emailSent) {
      return res.status(500).json({
        error: "Email bhejne mein problem hai! Try again later 📧"
      });
    }

    // Create user but don't save password yet (will be saved after OTP verification)
    const tempUser = { name, email, password };
    
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
app.post('/api/auth/verify-otp', [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('password').isLength({ min: 6 })
], async (req, res) => {
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
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
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
app.get('/api/auth/me', authenticateToken, (req, res) => {
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
app.post('/api/auth/resend-otp', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
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

// Routes
app.get('/api/', (req, res) => {
  res.json({ message: "SuckDSA API - Ready to roast some code!" });
});

app.get('/api/topics', (req, res) => {
  res.json(DSA_TOPICS);
});

// API Documentation
app.get('/api/docs', (req, res) => {
  const docs = {
    title: "SuckDSA API Documentation",
    description: "Savage DSA Teacher API powered by Google Gemini",
    version: "2.0.0",
    baseUrl: `http://localhost:${PORT}/api`,
    endpoints: [
      {
        method: "GET",
        path: "/",
        description: "API health check",
        response: { message: "SuckDSA API - Ready to roast some code!" }
      },
      {
        method: "GET", 
        path: "/topics",
        description: "Get all DSA topics",
        response: "Array of DSA topics with savage introductions"
      },
      {
        method: "POST",
        path: "/chat",
        description: "Chat with the savage DSA teacher",
        body: {
          message: "string (1-500 chars, required)",
          session_id: "UUID (optional)"
        },
        response: {
          response: "string (AI response)",
          session_id: "UUID"
        },
        rateLimit: "10 requests per minute"
      },
      {
        method: "GET",
        path: "/chat/history/:session_id",
        description: "Get chat history for a session",
        params: { session_id: "UUID (required)" },
        response: "Array of chat messages"
      }
    ],
    rateLimit: {
      global: "100 requests per 15 minutes",
      chat: "10 requests per minute"
    },
    errors: {
      400: "Bad Request - Invalid input",
      429: "Too Many Requests - Rate limit exceeded", 
      500: "Internal Server Error - Savage teacher having a bad day"
    }
  };
  
  res.json(docs);
});

app.post('/api/chat', 
  authenticateToken, // Require authentication
  chatLimiter, // Apply chat-specific rate limiting
  [
    body('message')
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Message must be between 1 and 500 characters')
      .escape(), // Sanitize input
    body('session_id')
      .optional()
      .isUUID()
      .withMessage('Session ID must be a valid UUID')
  ],
  async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: "Arre yaar! Your input is messier than a Mumbai street during monsoon! Fix these errors:",
        details: errors.array()
      });
    }

    const { message, session_id } = req.body;

    // Generate session ID if not provided
    const sessionId = session_id || uuidv4();

    // Get savage response from Google Gemini with retry logic
    let aiResponse;
    let retries = 3;
    
    while (retries > 0) {
      try {
        const fullPrompt = `${SAVAGE_SYSTEM_PROMPT}\n\nUser Question: ${message}\n\nSavage Response:`;
        const result = await model.generateContent(fullPrompt);
        aiResponse = result.response.text();
        break; // Success, exit retry loop
      } catch (geminiError) {
        retries--;
        console.log(`Gemini API error (${retries} retries left):`, geminiError.message);
        
        if (retries === 0) {
          // If all retries failed, provide a fallback response
          aiResponse = getFallbackResponse(message);
          console.log('Using fallback response due to Gemini API unavailability');
        } else {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, (4 - retries) * 1000));
        }
      }
    }

    // Store in database
    const chatRecord = new ChatMessage({
      session_id: sessionId,
      message: message,
      response: aiResponse
    });

    await chatRecord.save();

    res.json({
      response: aiResponse,
      session_id: sessionId
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: "Savage teacher is having a bad day. Try again!" 
    });
  }
});

app.get('/api/chat/history/:session_id', authenticateToken, async (req, res) => {
  try {
    const { session_id } = req.params;
    const messages = await ChatMessage.find({ session_id })
      .sort({ timestamp: 1 })
      .limit(100);
    
    res.json(messages);
  } catch (error) {
    console.error('History error:', error);
    res.json([]);
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      service: 'SuckDSA Backend (Node.js)',
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
      version: '2.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 SuckDSA Backend running on http://0.0.0.0:${PORT}`);
  console.log(`📚 Savage DSA teacher ready to roast!`);
});

module.exports = app;
