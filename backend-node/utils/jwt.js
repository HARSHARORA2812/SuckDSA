const jwt = require('jsonwebtoken');

// JWT Helper Functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'suckdsa-savage-secret', {
    expiresIn: '7d'
  });
};

module.exports = { generateToken };
