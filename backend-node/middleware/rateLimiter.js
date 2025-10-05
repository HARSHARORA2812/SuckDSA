const rateLimit = require('express-rate-limit');

// Global rate limiting
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

module.exports = { limiter, chatLimiter };
