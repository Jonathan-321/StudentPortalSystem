#!/bin/bash
# One-click deployment script for any Ubuntu VPS

echo "🚀 Student Portal System VPS Deployment Script"
echo "============================================="

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
echo "🐘 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Install nginx
echo "🔧 Installing nginx..."
sudo apt install -y nginx

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Setup PostgreSQL
echo "🐘 Setting up PostgreSQL..."
sudo -u postgres psql << EOF
CREATE DATABASE studentportal;
CREATE USER portaluser WITH PASSWORD 'portalpass123';
GRANT ALL PRIVILEGES ON DATABASE studentportal TO portaluser;
\q
EOF

# Clone and setup app
echo "📦 Setting up application..."
cd /opt
sudo git clone https://github.com/Jonathan-321/StudentPortalSystem.git
cd StudentPortalSystem
sudo chown -R $USER:$USER .

# Create .env file
echo "📝 Creating .env file..."
cat > .env << EOF
DATABASE_URL=postgresql://portaluser:portalpass123@localhost:5432/studentportal
PORT=3000
SESSION_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF

# Install dependencies and build
echo "🔨 Building application..."
npm ci
npm run build

# Setup PM2
echo "🚀 Starting application with PM2..."
pm2 start dist/index.js --name student-portal
pm2 startup systemd -u $USER --hp /home/$USER
pm2 save

# Setup nginx
echo "🔧 Configuring nginx..."
sudo tee /etc/nginx/sites-available/student-portal << EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/student-portal /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Setup firewall
echo "🔒 Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

echo "✅ Deployment complete!"
echo "Your app is running at http://YOUR_SERVER_IP"
echo ""
echo "PM2 commands:"
echo "  pm2 status          - Check app status"
echo "  pm2 logs            - View logs"
echo "  pm2 restart all     - Restart app"