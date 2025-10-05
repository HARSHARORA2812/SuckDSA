const express = require('express');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatMessage = require('../models/ChatMessage');
const { authenticateToken } = require('../middleware/auth');
const { chatLimiter } = require('../middleware/rateLimiter');
const { validateChat } = require('../middleware/validation');
const { getFallbackResponse } = require('../utils/responses');

const router = express.Router();

// Initialize Google Gemini
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

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

// Chat with AI
router.post('/', 
  authenticateToken, // Require authentication
  chatLimiter, // Apply chat-specific rate limiting
  validateChat,
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

// Get chat history
router.get('/history/:session_id', authenticateToken, async (req, res) => {
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

module.exports = router;
