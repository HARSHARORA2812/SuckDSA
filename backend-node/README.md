# SuckDSA Backend (Node.js)

🔥 **Savage DSA Teacher API** - A brutally honest DSA learning platform powered by Google Gemini AI with Indian cultural references.

## 🚀 Features

### **Core Functionality**
- **Google Gemini 2.5-Flash Integration** - Advanced AI responses with savage personality
- **MongoDB Database** - Chat history and session management
- **RESTful API** - Clean, documented endpoints
- **Input Validation** - Secure request handling with sanitization
- **Rate Limiting** - Prevents API abuse (100 req/15min global, 10 req/min chat)
- **Error Handling** - Graceful fallbacks and retry logic

### **Security & Performance**
- **Helmet.js** - Security headers protection
- **CORS** - Cross-origin resource sharing
- **Request Logging** - Morgan middleware for monitoring
- **Input Sanitization** - XSS protection with express-validator
- **Retry Logic** - Automatic fallback responses when AI is unavailable

### **Educational Content**
- **12 DSA Topics** - Comprehensive coverage from Arrays to Dynamic Programming
- **Savage Personality** - Indian cultural references and humor
- **Technical Accuracy** - Correct DSA explanations with memorable analogies
- **Fallback Responses** - Offline-capable basic explanations

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URL and Gemini API key

# Start development server
npm run dev

# Start production server
npm start
```

## 🔧 Environment Variables

```env
PORT=8001
MONGO_URL=mongodb://localhost:27017/suckdsa
DB_NAME=suckdsa
GEMINI_API_KEY=your_google_gemini_api_key_here
NODE_ENV=development
```

## 📚 API Documentation

### **Base URL**: `http://localhost:8001/api`

### **Endpoints**

#### `GET /`
Health check endpoint
```json
{
  "message": "SuckDSA API - Ready to roast some code!"
}
```

#### `GET /topics`
Get all DSA topics with savage introductions
```json
[
  {
    "name": "Arrays",
    "description": "Basic data structure to store elements",
    "savage_intro": "Arrays: Not your cricket team lineup, but close enough",
    "difficulty": "Beginner",
    "icon": "📊"
  }
]
```

#### `POST /chat`
Chat with the savage DSA teacher

**Request Body:**
```json
{
  "message": "explain arrays",
  "session_id": "optional-uuid"
}
```

**Response:**
```json
{
  "response": "Savage AI response with DSA explanation",
  "session_id": "generated-or-provided-uuid"
}
```

**Validation:**
- `message`: 1-500 characters, required
- `session_id`: Valid UUID, optional

**Rate Limit:** 10 requests per minute

#### `GET /chat/history/:session_id`
Get chat history for a specific session
```json
[
  {
    "id": "message-uuid",
    "session_id": "session-uuid",
    "message": "user question",
    "response": "ai response",
    "timestamp": "2025-01-06T00:00:00.000Z"
  }
]
```

#### `GET /docs`
Complete API documentation (this information in JSON format)

#### `GET /health`
Server health status
```json
{
  "status": "healthy",
  "timestamp": "2025-01-06T00:00:00.000Z",
  "service": "SuckDSA Backend (Node.js)"
}
```

## 🛡️ Rate Limiting

- **Global**: 100 requests per 15 minutes per IP
- **Chat**: 10 requests per minute per IP
- **Custom Error Messages**: Savage-style rate limit messages

## 🔄 Error Handling

### **Validation Errors (400)**
```json
{
  "error": "Arre yaar! Your input is messier than a Mumbai street during monsoon!",
  "details": [
    {
      "msg": "Message must be between 1 and 500 characters",
      "path": "message"
    }
  ]
}
```

### **Rate Limit Errors (429)**
```json
{
  "error": "Slow down, speed racer! Even the savage teacher needs time to think. Wait a minute! 🐌"
}
```

### **Server Errors (500)**
```json
{
  "error": "Savage teacher is having a bad day. Try again!"
}
```

## 🧠 AI Features

### **Google Gemini Integration**
- **Model**: gemini-2.5-flash
- **Retry Logic**: 3 attempts with exponential backoff
- **Fallback Responses**: Offline-capable basic explanations
- **Custom Prompts**: Savage DSA teacher personality

### **Fallback System**
When Gemini API is unavailable, the system provides pre-written savage responses for:
- Arrays
- Stacks
- Linked Lists
- Queues
- General encouragement

## 📊 DSA Topics Covered

1. **Arrays** - Basic data structures
2. **Linked Lists** - Dynamic linear structures
3. **Stacks** - LIFO operations
4. **Queues** - FIFO operations
5. **Hash Tables** - Key-value storage
6. **Trees** - Hierarchical structures
7. **Binary Search Trees** - Ordered trees
8. **Heaps** - Priority queues
9. **Graphs** - Connected networks
10. **Dynamic Programming** - Optimization techniques
11. **Sorting Algorithms** - Data arrangement
12. **Searching Algorithms** - Element finding

## 🚀 Deployment

### **Development**
```bash
npm run dev  # Uses nodemon for auto-reload
```

### **Production**
```bash
npm start    # Standard Node.js server
```

### **Docker** (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8001
CMD ["npm", "start"]
```

## 🔧 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **AI**: Google Generative AI (Gemini)
- **Security**: Helmet, CORS, express-validator
- **Monitoring**: Morgan logging
- **Development**: Nodemon

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/savage-enhancement`)
3. Commit changes (`git commit -am 'Add savage feature'`)
4. Push to branch (`git push origin feature/savage-enhancement`)
5. Create Pull Request

## 📝 License

MIT License - Feel free to roast and learn!

## 🔥 Savage Quotes

> "Your code is like a Bollywood movie - dramatic, confusing, but somehow it works!"

> "Arrays are like your cricket team lineup - positions matter, and changing batting order is a pain!"

> "Stop coding like your cupboard is having a garage sale!"

---

**Built with ❤️ and lots of chai by the SuckDSA team** ☕
