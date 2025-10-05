const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

module.exports = { authenticateToken };
