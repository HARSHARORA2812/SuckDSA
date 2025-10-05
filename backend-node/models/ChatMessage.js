const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// MongoDB Schema
const chatMessageSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  session_id: { type: String, required: true },
  message: { type: String, required: true },
  response: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
