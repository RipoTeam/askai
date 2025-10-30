# AskAI - Full-Featured AI Chat Application

A comprehensive ChatGPT-like application with advanced features including authentication, chat history, file uploads, code canvas, voice calls, and agent mode.

## 🌟 100% FREE - No Credit Card Required!

This app uses **Google's Gemini API** which is completely FREE with generous limits. No payment needed!

## Features

- ✅ **User Authentication** - Secure login and signup with JWT
- ✅ **Chat Management** - Create, view, and delete chat conversations
- ✅ **AI Integration** - Powered by FREE Google Gemini AI
- ✅ **File Upload** - Upload and analyze PDFs, DOCX, images, and code files
- ✅ **Code Canvas** - Write, edit, and download code directly in the app
- ✅ **Voice Calls** - Real-time voice communication with AI
- ✅ **Agent Mode** - Enhanced AI capabilities for complex tasks
- ✅ **Settings** - Customize theme, model, temperature, and more
- ✅ **Chat History** - All conversations are saved and searchable
- ✅ **Modern UI** - Beautiful dark/light theme with Tailwind CSS
- ✅ **Deploy to Vercel** - One-click deployment included!

## Tech Stack

### Backend
- **Node.js** with Express
- **SQLite** with better-sqlite3
- **Google Gemini API** for FREE AI responses
- **Socket.io** for real-time voice calls
- **JWT** for authentication
- **Multer** for file uploads

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Socket.io-client** for real-time features

## Quick Start

See **QUICKSTART.md** for the fastest way to get started!

## Installation

### Prerequisites
- Node.js 16+ installed
- FREE Gemini API key ([Get one here](https://makersuite.google.com/app/apikey)) - No credit card!

### Setup Instructions

1. **Clone or navigate to the project directory**
```bash
cd askai
```

2. **Install root dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Create backend .env file**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your FREE Gemini API key:
```
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this
GEMINI_API_KEY=your_free_gemini_api_key_here
NODE_ENV=development
```

**Get your FREE Gemini API key:**
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy and paste into `.env`

5. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

6. **Install required Tailwind plugin**
```bash
npm install -D tailwindcss-animate
```

## Running the Application

### Development Mode

From the root directory, run both frontend and backend concurrently:

```bash
npm run dev
```

Or run them separately:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Usage

1. **Sign Up** - Create a new account with email and password
2. **Login** - Sign in to access the chat interface
3. **New Chat** - Click "New Chat" to start a conversation
4. **Upload Files** - Click the paperclip icon to upload files for AI analysis
5. **Code Canvas** - Click the code icon to open the code editor
6. **Voice Call** - Click the microphone icon to start voice communication
7. **Agent Mode** - Enable in settings for enhanced AI capabilities
8. **Settings** - Customize AI model, temperature, theme, and more

## Project Structure

```
askai/
├── backend/
│   ├── routes/          # API route handlers
│   ├── middleware/      # Authentication middleware
│   ├── database.js      # Database setup and queries
│   ├── server.js        # Express server
│   └── uploads/         # Uploaded files storage
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Zustand state management
│   │   └── lib/         # Utility functions
│   └── public/          # Static assets
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Chats
- `GET /api/chats` - Get all user chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:chatId` - Get chat with messages
- `PATCH /api/chats/:chatId` - Update chat title
- `DELETE /api/chats/:chatId` - Delete chat

### AI
- `POST /api/ai/chat/:chatId` - Send message and get AI response
- `POST /api/ai/chat/:chatId/stream` - Stream AI response

### Files
- `POST /api/files/upload/:chatId` - Upload file
- `GET /api/files/:chatId` - Get chat files
- `GET /api/files/download/:fileId` - Download file

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings

### Code Canvas
- `POST /api/canvas/:chatId` - Create code canvas
- `GET /api/canvas/:chatId` - Get all canvases
- `PUT /api/canvas/:canvasId` - Update canvas
- `DELETE /api/canvas/:canvasId` - Delete canvas

## Features in Detail

### File Upload & Analysis
Upload various file types (PDF, DOCX, TXT, images, code files) and the AI will analyze and extract content automatically.

### Code Canvas
A built-in code editor where you can write, edit, and download code. Supports multiple languages including JavaScript, Python, HTML, CSS, and more.

### Voice Calls
Real-time voice communication using WebRTC and Socket.io. Click the microphone icon to start recording and communicate with the AI.

### Agent Mode
When enabled, the AI operates with enhanced capabilities, providing more thorough and proactive responses for complex tasks.

### Customizable Settings
- **Theme**: Light or Dark mode
- **AI Model**: Gemini Pro (FREE!)
- **Temperature**: Control response randomness (0-1)
- **Max Tokens**: Set maximum response length
- **Agent Mode**: Toggle advanced AI capabilities
- **Voice Enabled**: Enable/disable voice features

## Deploy to Vercel

Want your app live on the internet? Deploy to Vercel for FREE!

See **DEPLOYMENT.md** for complete instructions.

Quick deploy:
```bash
npm install -g vercel
vercel
```

## Gemini API Limits (Free Tier)

- **60 requests per minute** - More than enough for personal use!
- **1,500 requests per day**
- **1 million tokens per day**

Completely FREE. No credit card required! 🎉

## Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens for secure authentication
- File uploads are validated and stored securely
- API keys should never be committed to version control

## Troubleshooting

### Port already in use
If port 5000 or 5173 is already in use, you can change them:
- Backend: Edit `PORT` in `backend/.env`
- Frontend: Edit `server.port` in `frontend/vite.config.ts`

### Gemini API errors
- Ensure your API key is valid
- Get a FREE key at: https://makersuite.google.com/app/apikey
- Check you haven't exceeded the free tier limits

### Database issues
If you encounter database errors, delete `backend/database.db` and restart the server to create a fresh database.

## License

MIT License - feel free to use this project for learning or personal use.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on the repository.

---

Built with ❤️ using React, Node.js, and OpenAI
