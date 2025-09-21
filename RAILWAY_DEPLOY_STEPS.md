# 🚂 Railway Deployment Steps

Follow these commands in your terminal:

## Step 1: Login to Railway
```bash
railway login
```
- This opens your browser
- Create a free Railway account (no credit card needed)
- Authorize the CLI

## Step 2: Initialize Project
```bash
railway init
```
- Choose "Empty Project"
- Give it a name: `student-portal-ur`

## Step 3: Add PostgreSQL
```bash
railway add postgresql
```
This creates a free PostgreSQL database

## Step 4: Link Your Repo & Deploy
```bash
railway link
railway up
```
This deploys your current code

## Step 5: Set Environment Variables
```bash
# Generate a secure session secret
railway variables set SESSION_SECRET=$(openssl rand -hex 32)

# Set production environment
railway variables set NODE_ENV=production
```

## Step 6: Open Your App
```bash
railway open
```
Your app is now live! 🎉

## Step 7: Check Deployment Status
```bash
railway status
railway logs
```

## Troubleshooting

### If build fails:
```bash
# Check logs
railway logs

# Common fix: ensure PORT uses environment variable
# Railway sets PORT automatically
```

### Database Connection:
Railway automatically injects DATABASE_URL - no configuration needed!

### View your app:
Your URL will be something like:
`https://student-portal-ur.up.railway.app`

## Continuous Deployment

Every time you push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Railway automatically rebuilds and deploys!

---

**Need help?** Check the Railway dashboard at https://railway.app