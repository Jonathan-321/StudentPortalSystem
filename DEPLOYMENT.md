# 🚀 Deployment Guide

## Quick Deploy Options (Choose One)

### Option 1: Railway (Recommended - Easiest)
Railway provides PostgreSQL and web hosting in one platform with a generous free tier.

1. **Fork/Clone the repo**
   ```bash
   git clone https://github.com/Jonathan-321/StudentPortalSystem.git
   cd StudentPortalSystem
   ```

2. **Sign up at [Railway.app](https://railway.app)**

3. **Deploy via CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway add postgresql
   railway up
   ```

4. **Set environment variables in Railway dashboard**
   - DATABASE_URL (automatically set by Railway)
   - SESSION_SECRET=your-secret-key-here

### Option 2: Render.com (Free PostgreSQL)

1. **Create account at [Render.com](https://render.com)**

2. **Create PostgreSQL database first**
   - New → PostgreSQL
   - Copy the External Database URL

3. **Create Web Service**
   - New → Web Service
   - Connect GitHub repo
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Add DATABASE_URL environment variable

### Option 3: Vercel + Supabase (Modern Stack)

1. **Database: [Supabase](https://supabase.com)**
   - Create new project
   - Copy connection string from Settings → Database

2. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```
   - Set DATABASE_URL in environment variables

### Option 4: DigitalOcean App Platform

1. **Create app from GitHub**
2. **Add PostgreSQL database component**
3. **Auto-deploys on push**

## Pre-Deployment Checklist

1. **Update production build settings**
   ```json
   // package.json - Already configured!
   "scripts": {
     "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
     "start": "NODE_ENV=production node dist/index.js"
   }
   ```

2. **Environment Variables Required**
   ```env
   DATABASE_URL=postgresql://...
   SESSION_SECRET=generate-random-string-here
   NODE_ENV=production
   ```

3. **Test production build locally**
   ```bash
   npm run build
   DATABASE_URL=your-db-url npm run start
   ```

## Post-Deployment Steps

1. **Initialize Database**
   - Most platforms auto-run migrations
   - If not: `npm run db:push`

2. **Test the deployment**
   - Visit your-app.railway.app
   - Try login with test credentials
   - Check all API endpoints

3. **Monitor logs**
   - Railway: `railway logs`
   - Render: Dashboard → Logs
   - Vercel: `vercel logs`

## Domain Setup (Optional)

1. **Get custom domain** from Namecheap/GoDaddy
2. **Add CNAME record** pointing to your deployment URL
3. **Enable HTTPS** (automatic on most platforms)

## Quick Deploy Script

Save time with this one-liner for Railway:
```bash
railway login && railway init && railway add postgresql && railway up && railway open
```

---

**Need help?** Most common issues:
- Database connection: Check DATABASE_URL format
- Build fails: Ensure all dependencies are in package.json
- 500 errors: Add logging to debug production issues