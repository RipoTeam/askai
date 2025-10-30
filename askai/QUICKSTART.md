# Quick Start Guide - AskAI

Get your AI chat app running in 5 minutes! 🚀

## Step 1: Get Your FREE Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google (it's FREE - no credit card!)
3. Click **"Create API Key"**
4. Copy your API key (starts with `AIza...`)

## Step 2: Install Dependencies

Open terminal in the `askai` folder and run:

```bash
# Install root dependencies
npm install

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
npm install -D tailwindcss-animate
```

## Step 3: Configure Environment

In the `backend` folder:

```bash
# Copy the example file
cp .env.example .env
```

Open `backend/.env` and paste your Gemini API key:

```
PORT=5000
JWT_SECRET=my_super_secret_key_123456
GEMINI_API_KEY=AIza...your_actual_api_key_here
NODE_ENV=development
```

## Step 4: Run the App

From the root `askai` folder:

```bash
npm run dev
```

This starts both frontend and backend!

Open http://localhost:5173 in your browser 🎉

## First Time Usage

1. Click **"Sign up"**
2. Create an account (email + password)
3. Click **"New Chat"**
4. Start chatting with AI for FREE!

## Deploy to Vercel (Optional)

Want to share your app online? See `DEPLOYMENT.md` for full instructions.

Quick deploy:
```bash
npm install -g vercel
vercel
```

That's it! You now have your own ChatGPT-like app! 🎊

---

**Need help?** Check README.md for detailed documentation.
