# 🌊 DigitalOcean App Platform Deployment

## Step-by-Step Deployment Guide

### Step 1: Account Setup
1. Go to [DigitalOcean](https://www.digitalocean.com/)
2. Sign up (you get $200 free credit for 60 days!)
3. Add a payment method (required but won't charge during free trial)

### Step 2: Create App via Dashboard

1. **Click "Create" → "Apps"**

2. **Choose Source**
   - Select "GitHub"
   - Authorize DigitalOcean to access your GitHub
   - Choose repository: `Jonathan-321/StudentPortalSystem`
   - Branch: `main`
   - Autodeploy: ✅ Enable

3. **Configure Your App**
   - Source Directory: `/` (root)
   - Detected Type: Node.js

4. **Edit Plan** (Important!)
   ```
   Build Command: npm install && npm run build
   Run Command: npm run start
   HTTP Port: 3000
   ```

5. **Add Database**
   - Click "Add Resource"
   - Choose "Database"
   - Select "PostgreSQL"
   - Choose "Basic" plan ($15/month but covered by credit)
   - Name: `student-portal-db`

6. **Environment Variables**
   Click "Edit" next to your web service and add:
   - `NODE_ENV` = `production`
   - `SESSION_SECRET` = `generate-a-random-string-here`
   - `DATABASE_URL` = Click "Use Database URL" and select your DB

### Step 3: Deploy!

1. Click **"Create Resources"**
2. Wait 5-10 minutes for deployment
3. Your app will be live at: `https://your-app-name.ondigitalocean.app`

### Step 4: Initialize Database

Once deployed, you need to push the schema:

1. Go to App → Console tab
2. Run: `npm run db:push`
3. This creates all tables and seeds initial data

### Step 5: Verify Everything Works

Test these endpoints:
- `https://your-app.ondigitalocean.app` - Should show login page
- Login with `john` / `password`
- Check dashboard loads with courses

## 🔄 Continuous Deployment

Your app now auto-deploys on every push to main:

```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push origin main
# DigitalOcean automatically deploys!
```

## 💰 Cost Breakdown

With $200 credit, you can run for FREE for 2 months:
- App: $5/month (Basic plan)
- Database: $15/month (Basic PostgreSQL)
- Total: $20/month

After credit expires:
- Downgrade to Starter tier (free but limited)
- Or continue at $20/month

## 🛠️ Troubleshooting

### "Build Failed"
Check build logs for missing dependencies. Common fix:
```bash
npm install
git add package-lock.json
git commit -m "Update lockfile"
git push
```

### "Database Connection Error"
1. Check DATABASE_URL is set correctly
2. Ensure database is in same region as app
3. Check logs: App → Runtime Logs

### "App Crashes on Start"
1. Check if PORT is hardcoded (should use process.env.PORT)
2. Verify build output exists
3. Check memory usage (might need bigger instance)

## 📊 Monitoring

1. **Insights Tab**: See requests, errors, response times
2. **Alerts**: Set up notifications for downtime
3. **Logs**: Runtime Logs show all console output

## 🚀 Quick Deploy Alternative

Use the app.yaml file:
```bash
doctl apps create --spec app.yaml
```

(Requires [DigitalOcean CLI](https://docs.digitalocean.com/reference/doctl/how-to/install/))

## 🎯 Next Steps After Deploy

1. **Custom Domain** ($0)
   - Add domain in Settings
   - Update DNS records
   - SSL certificate auto-generated

2. **Enable Metrics** (Free)
   - Go to Insights
   - Enable extended metrics

3. **Set Up Backups** ($2/month)
   - Database → Settings → Backups
   - Daily automatic backups

---

**Your app will be live in ~10 minutes!** 🎉

Share the link: `https://student-portal-ur-xxxxx.ondigitalocean.app`