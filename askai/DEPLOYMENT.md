# Deployment Guide - Vercel

This guide will help you deploy your AskAI application to Vercel for FREE!

## Prerequisites

1. A Vercel account (sign up at https://vercel.com - it's free!)
2. A Google Gemini API key (FREE - get it at https://makersuite.google.com/app/apikey)

## Getting Your Free Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key (starts with "AIza...")
5. Keep it safe - you'll need it for deployment!

**Note**: Gemini API is completely FREE with generous limits (60 requests per minute). No credit card required!

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy from project root**
```bash
cd askai
vercel
```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - What's your project's name? **askai** (or any name you want)
   - In which directory is your code located? **.**
   - Want to override the settings? **No**

5. **Set Environment Variables**

After first deployment, add your environment variables:

```bash
vercel env add GEMINI_API_KEY
```
Paste your Gemini API key when prompted, select **Production**, and press Enter.

```bash
vercel env add JWT_SECRET
```
Enter a random secure string (e.g., `my-super-secret-jwt-key-12345`), select **Production**.

6. **Redeploy with environment variables**
```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub**
   - Create a new repository on GitHub
   - Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   
   Before deploying, add these environment variables:
   
   - `GEMINI_API_KEY`: Your free Gemini API key
   - `JWT_SECRET`: Any random secure string (e.g., `my-secret-key-12345`)
   - `NODE_ENV`: `production`

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (2-3 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

## Post-Deployment

1. **Test your deployment**
   - Visit your Vercel URL
   - Sign up for an account
   - Start chatting!

2. **Custom Domain (Optional)**
   - Go to your project settings in Vercel
   - Add a custom domain if you have one
   - Vercel provides free SSL automatically!

## Troubleshooting

### Database Issues

**Note**: Vercel uses serverless functions, which means the SQLite database will reset between deployments. For a production app, you should use a hosted database like:
- **Supabase** (free tier available)
- **PlanetScale** (free tier available)
- **Railway** (free tier available)

For now, the app works but will reset data between deployments.

### API Errors

If you see "API key not configured":
1. Check that `GEMINI_API_KEY` is set in Vercel environment variables
2. Redeploy after adding environment variables

### Build Failures

If the build fails:
1. Check the Vercel build logs
2. Ensure all dependencies are in `package.json`
3. Try running `npm run build` locally first

## Local Development

To run locally with Gemini:

1. **Copy environment file**
```bash
cd backend
cp .env.example .env
```

2. **Edit `.env` and add your Gemini API key**
```
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=any_random_secret_string
```

3. **Install dependencies**
```bash
# Root
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
npm install -D tailwindcss-animate
```

4. **Run the app**
```bash
# From root directory
npm run dev
```

Visit http://localhost:5173

## Gemini API Limits (Free Tier)

- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per day**

This is more than enough for personal use and testing!

## Upgrading to Production Database

When you're ready for a permanent database:

1. **Use Supabase (Recommended)**
   - Sign up at https://supabase.com
   - Create a new project
   - Use Supabase's PostgreSQL instead of SQLite
   - Update database.js to use PostgreSQL

2. **Or use Vercel Postgres**
   - Enable in your Vercel project
   - Follow Vercel's PostgreSQL guide

## Support

- **Gemini API Docs**: https://ai.google.dev/docs
- **Vercel Docs**: https://vercel.com/docs
- **Issues**: Open an issue on your GitHub repository

---

## Quick Reference

**Gemini API Key**: https://makersuite.google.com/app/apikey  
**Vercel Dashboard**: https://vercel.com/dashboard  
**Deploy Command**: `vercel --prod`

Enjoy your FREE AI chat application! 🎉
