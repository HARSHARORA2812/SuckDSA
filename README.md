# 🔥 SuckDSA - Savage DSA Learning Platform

A brutally honest DSA (Data Structures & Algorithms) learning platform with AI-powered teaching, featuring savage roasts and Indian cultural references to make learning memorable and fun.

## 🚀 Live Demo

- **Frontend**: [https://suckdsa.vercel.app]((https://suck-dsa.vercel.app/))
- **Backend API**: [https://suckdsa-backend.onrender.com](https://suckdsa-backend.onrender.com)
- **API Documentation**: [https://suckdsa-backend.onrender.com/api/docs](https://suckdsa-backend.onrender.com/api/docs)

## ⚡ Features

### 🎯 Core Features
- **AI-Powered Teaching**: Google Gemini 2.5-Flash integration for savage DSA explanations
- **Authentication System**: Email-based registration with OTP verification
- **Interactive Chat**: Real-time chat with the savage DSA teacher
- **Beautiful UI**: Modern glassmorphism design with orange/red theme
- **Responsive Design**: Works perfectly on desktop and mobile

### 🔥 Savage Teaching Style
- **Indian Cultural References**: Bollywood, cricket, chai-samosa analogies
- **Memorable Roasts**: "chappal-level coder", "brain = Windows XP"
- **Educational Core**: Technically accurate explanations with humor
- **DSA Topics**: Arrays, Stacks, Trees, Graphs, and more

### 🛡️ Security & Performance
- **JWT Authentication**: Secure token-based auth system
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive validation and sanitization
- **CORS Protection**: Secure cross-origin requests
- **Production Ready**: Deployed on Render + Vercel

## 🏗️ Tech Stack

### Frontend (React + Vite)
- **React 18** with modern hooks
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls
- **React Router** for navigation

### Backend (Node.js + Express)
- **Express.js** web framework
- **MongoDB** with Mongoose ODM
- **Google Generative AI** (Gemini)
- **JWT** for authentication
- **Nodemailer** for email OTP
- **Rate limiting** and security middleware

### Database & Services
- **MongoDB Atlas** - Cloud database
- **Gmail SMTP** - Email service
- **Google Gemini AI** - AI responses
- **Render** - Backend hosting
- **Vercel** - Frontend hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key
- Gmail app password

### 1. Clone Repository
```bash
git clone https://github.com/harsha-arora/SuckDSA.git
cd SuckDSA
```

### 2. Backend Setup
```bash
cd backend-node
npm install

# Create .env file
cp .env.example .env
# Add your environment variables

# Start backend
npm start
```

### 3. Frontend Setup
```bash
cd ../SuckDSA
npm install

# Create .env file
cp .env.example .env
# Add backend URL

# Start frontend
npm run dev
```

### 4. Environment Variables

#### Backend (.env)
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/suckdsa
JWT_SECRET=your-super-secure-jwt-secret
GEMINI_API_KEY=your-google-gemini-api-key
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
NODE_ENV=development
PORT=8001
```

#### Frontend (.env)
```env
VITE_BACKEND_URL=http://localhost:8001
```

## 📁 Project Structure

```
SuckDSA/
├── SuckDSA/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── ui/            # UI components
│   │   │   └── ...
│   │   ├── contexts/          # React contexts
│   │   └── ...
│   ├── public/                # Static assets
│   └── package.json
│
├── backend-node/              # Backend (Node.js + Express)
│   ├── config/               # Configuration files
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── middleware/           # Express middleware
│   ├── utils/                # Utility functions
│   ├── server.js             # Main server file
│   └── package.json
│
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register with OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/resend-otp` - Resend OTP

### Chat & Learning
- `POST /api/chat` - Chat with AI teacher (auth required)
- `GET /api/chat/history/:session_id` - Get chat history
- `GET /api/topics` - Get DSA topics

### System
- `GET /health` - Health check
- `GET /api/docs` - API documentation

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Orange/red gradients with dark backgrounds
- **Typography**: Modern font hierarchy
- **Glassmorphism**: Backdrop blur effects
- **Animations**: Smooth transitions and hover effects

### Authentication Flow
- **Beautiful Forms**: Matching SuckDSA theme
- **OTP Verification**: 6-digit input with timer
- **Error Handling**: Savage error messages
- **Responsive**: Works on all devices

### Chat Interface
- **Real-time**: Instant AI responses
- **Message Styling**: User vs AI message differentiation
- **Loading States**: Elegant loading animations
- **Character Limits**: 500 character input limit

## 🚀 Deployment

### Backend (Render)
1. Connect GitHub repository
2. Set root directory to `backend-node`
3. Configure environment variables
4. Deploy with `npm start`

### Frontend (Vercel)
1. Connect GitHub repository
2. Set root directory to `SuckDSA`
3. Configure `VITE_BACKEND_URL`
4. Deploy with Vite preset

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

> "Arrays are like your cricket team lineup - positions matter!"

> "Stop coding like your cupboard is having a garage sale!"

---

**Built with ❤️ and lots of chai by the SuckDSA team** ☕

*Ready to get roasted while learning DSA? Join the savage revolution!* 🚀 - Savage DSA Learning Platform

Learn Data Structures & Algorithms with a brutally honest AI teacher that uses Indian cultural references and humor to make concepts stick.

## 🔥 Features

- **Savage AI Teacher**: Get roasted while learning with culturally relevant Indian analogies
- **Interactive Chat Interface**: Modern, responsive chat UI with topic shortcuts
- **DSA Topics**: Arrays, Stacks, Trees, Graphs, and more with savage explanations
- **PWA Support**: Install as a mobile/desktop app
- **Session Management**: Chat history and personalized learning paths

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Python 3.8+
- MongoDB (local or cloud)
- OpenAI API Key

### Frontend Setup

```bash
cd SuckDSA
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Update .env file with your OpenAI API key
echo "OPENAI_API_KEY=your_actual_openai_key" > .env

# Start the backend
./start-backend.sh
```

The backend will run on `http://localhost:8001`

### Environment Variables

**Frontend (.env)**:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

**Backend (.env)**:
```
MONGO_URL="mongodb://localhost:27017"
DB_NAME="suckdsa_database"
CORS_ORIGINS="*"
OPENAI_API_KEY=your_openai_api_key_here
```

## 🛠️ Tech Stack

**Frontend:**
- React 19 + Vite
- Tailwind CSS
- Lucide React Icons
- Axios for API calls
- React Router for navigation

**Backend:**
- FastAPI (Python)
- OpenAI GPT-4o
- MongoDB with Motor (async)
- Uvicorn ASGI server

## 🎯 Usage

1. Start both frontend and backend servers
2. Navigate to `http://localhost:5173`
3. Click "Get Roasted & Learn" to start chatting
4. Select DSA topics or ask direct questions
5. Get savage but educational responses!

## 🔧 Fixed Issues

- ✅ Added missing dependencies (react-router-dom, axios, lucide-react, etc.)
- ✅ Fixed backend API model (switched from GPT-5 to GPT-4o)
- ✅ Created proper manifest.json for PWA support
- ✅ Fixed import paths in UI components
- ✅ Added environment variables
- ✅ Replaced emergentintegrations with direct OpenAI integration
- ✅ Created virtual environment and startup scripts

## 📱 PWA Installation

The app supports Progressive Web App installation:
- Chrome: Click install icon in address bar
- Mobile: "Add to Home Screen" option
- Desktop: Install via browser menu

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - Built with 🔥 for Indian developers

---

**Note**: Make sure to add your actual OpenAI API key to the backend `.env` file before running the application.
