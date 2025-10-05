const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

// Import configurations
const connectDB = require('./config/database');
const corsOptions = require('./config/cors');

// Import middleware
const { limiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const topicsRoutes = require('./routes/topics');

const app = express();
const PORT = process.env.PORT || 8001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('combined')); // Request logging
app.use(limiter); // Apply rate limiting to all requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get('/api/', (req, res) => {
  res.json({ message: "SuckDSA API - Ready to roast some code!" });
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
        rateLimit: "10 requests per minute",
        authentication: "Bearer token required"
      },
      {
        method: "GET",
        path: "/chat/history/:session_id",
        description: "Get chat history for a session",
        params: { session_id: "UUID (required)" },
        response: "Array of chat messages",
        authentication: "Bearer token required"
      },
      {
        method: "POST",
        path: "/auth/register",
        description: "Register new user with OTP verification",
        body: {
          name: "string (required)",
          email: "string (required)",
          password: "string (6+ chars, required)"
        }
      },
      {
        method: "POST",
        path: "/auth/verify-otp",
        description: "Verify OTP and complete registration",
        body: {
          email: "string (required)",
          otp: "string (6 digits, required)",
          name: "string (required)",
          password: "string (required)"
        }
      },
      {
        method: "POST",
        path: "/auth/login",
        description: "User login",
        body: {
          email: "string (required)",
          password: "string (required)"
        }
      },
      {
        method: "GET",
        path: "/auth/me",
        description: "Get current user info",
        authentication: "Bearer token required"
      }
    ],
    rateLimit: {
      global: "100 requests per 15 minutes",
      chat: "10 requests per minute"
    },
    errors: {
      400: "Bad Request - Invalid input",
      401: "Unauthorized - Authentication required",
      403: "Forbidden - Invalid token",
      429: "Too Many Requests - Rate limit exceeded", 
      500: "Internal Server Error - Savage teacher having a bad day"
    }
  };
  
  res.json(docs);
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/topics', topicsRoutes);

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
  console.log(`🏗️  Modular architecture loaded successfully!`);
});

module.exports = app;
