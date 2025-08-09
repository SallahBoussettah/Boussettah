#!/bin/bash

echo "🚀 Quick Fix for Upload Issues..."
echo "================================"

# Check if we're on the VPS
if [ ! -d "/var/www/portfolio" ]; then
    echo "❌ This script should be run on the VPS server"
    exit 1
fi

cd /var/www/portfolio

echo "1️⃣ Updating NGINX configuration..."
sudo cp nginx.conf /etc/nginx/sites-available/portfolio
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo "✅ NGINX configuration updated and reloaded"
else
    echo "❌ NGINX configuration has errors - please check manually"
    exit 1
fi

echo -e "\n2️⃣ Fixing file permissions..."
sudo chown -R www-data:www-data /var/www/portfolio/backend/uploads
sudo chmod -R 755 /var/www/portfolio/backend/uploads
echo "✅ File permissions fixed"

echo -e "\n3️⃣ Restarting backend with updated code..."
pm2 restart portfolio-backend
sleep 3
echo "✅ Backend restarted"

echo -e "\n4️⃣ Testing upload endpoint..."
sleep 2
UPLOAD_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/upload/test)
if [ "$UPLOAD_TEST" = "200" ]; then
    echo "✅ Upload endpoint is working (Status: $UPLOAD_TEST)"
else
    echo "❌ Upload endpoint failed (Status: $UPLOAD_TEST)"
    echo "Checking backend logs..."
    pm2 logs portfolio-backend --lines 5
fi

echo -e "\n5️⃣ Testing static file serving..."
if [ -f "/var/www/portfolio/backend/uploads/art/art-1754705630284-150928017.jpg" ]; then
    STATIC_TEST=$(curl -s -o /dev/null -w "%{http_code}" https://boussettahsalah.online/uploads/art/art-1754705630284-150928017.jpg)
    if [ "$STATIC_TEST" = "200" ]; then
        echo "✅ Static file serving is working (Status: $STATIC_TEST)"
    else
        echo "❌ Static file serving failed (Status: $STATIC_TEST)"
    fi
else
    echo "⚠️  Test file not found - upload a new image to test"
fi

echo -e "\n🎉 Quick fix completed!"
echo "📊 Check status: pm2 status"
echo "📋 Check logs: pm2 logs"
echo "🔄 Try uploading an image now"