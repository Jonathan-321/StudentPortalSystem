# Deployment Guide

## Recommended Option: Fly.io (Free Tier)

1. Install Fly CLI:
   ```bash
   # macOS
   brew install flyctl
   
   # Or via curl
   curl -L https://fly.io/install.sh | sh
   ```

2. Sign up and authenticate:
   ```bash
   fly auth signup
   # or if you have an account
   fly auth login
   ```

3. Deploy the app:
   ```bash
   # From the project root
   fly launch
   # When prompted:
   # - Choose a unique app name
   # - Select a region close to you
   # - Say YES to setting up PostgreSQL
   # - Say NO to Redis
   ```

4. Set environment variables:
   ```bash
   fly secrets set SESSION_SECRET=$(openssl rand -base64 32)
   ```

5. Access your app:
   ```bash
   fly open
   ```

## Alternative: VPS Deployment (DigitalOcean, Linode, etc.)

1. Get a VPS (Ubuntu 22.04 recommended)
   - DigitalOcean: $6/month droplet
   - Linode: $5/month instance
   - Vultr: $6/month instance

2. SSH into your server and run:
   ```bash
   wget https://raw.githubusercontent.com/Jonathan-321/StudentPortalSystem/main/deploy-vps.sh
   chmod +x deploy-vps.sh
   ./deploy-vps.sh
   ```

3. Your app will be available at `http://YOUR_SERVER_IP`

## Why These Options?

- **Fly.io**: Handles everything automatically, free PostgreSQL, great for Node.js apps
- **VPS**: Full control, predictable costs, can host multiple apps

## Avoid These Platforms

- **Vercel/Netlify**: Designed for static sites and serverless functions, not full Express apps with sessions
- **Railway/Render**: You've already experienced issues with these

## Local Testing

Always test locally first:
```bash
# Start PostgreSQL locally
# Set up .env file
npm run dev
```

## Support

If you need help with deployment, the Fly.io community forum is very helpful: https://community.fly.io/