#!/bin/bash

echo "🔧 Fixing VPS Issues..."

# 1. Stop current PM2 processes
echo "1️⃣ Stopping current PM2 processes..."
pm2 stop all
pm2 delete all

# 2. Update NGINX configuration
echo "2️⃣ Updating NGINX configuration..."
sudo cp nginx.conf /etc/nginx/sites-available/portfolio
sudo nginx -t && sudo systemctl reload nginx

# 3. Fix file permissions
echo "3️⃣ Fixing upload directory permissions..."
sudo chown -R www-data:www-data /var/www/portfolio/backend/uploads
sudo chmod -R 755 /var/www/portfolio/backend/uploads

# 4. Restart backend with proper proxy trust
echo "4️⃣ Starting backend..."
cd /var/www/portfolio/backend
pm2 start server.js --name "portfolio-backend" --env production

# 5. Start frontend in correct mode
echo "5️⃣ Starting frontend..."
cd /var/www/portfolio/frontend
# Check if standalone build exists
if [ -f ".next/standalone/server.js" ]; then
    echo "Using standalone mode..."
    pm2 start .next/standalone/server.js --name "portfolio-frontend" --env production
else
    echo "Building for standalone mode..."
    npm run build
    cp -r public .next/standalone/
    cp -r .next/static .next/standalone/.next/
    pm2 start .next/standalone/server.js --name "portfolio-frontend" --env production
fi

# 6. Save PM2 configuration
pm2 save

echo "✅ VPS issues fixed!"
echo "📊 Check status: pm2 status"
echo "📋 Check logs: pm2 logs"