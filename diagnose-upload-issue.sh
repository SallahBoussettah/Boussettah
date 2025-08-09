#!/bin/bash

echo "🔍 Diagnosing Upload Issues..."
echo "================================"

# Check if we're on the VPS
if [ ! -d "/var/www/portfolio" ]; then
    echo "❌ This script should be run on the VPS server"
    exit 1
fi

echo "1️⃣ Checking PM2 processes..."
pm2 status

echo -e "\n2️⃣ Checking backend logs for errors..."
echo "Recent backend errors:"
pm2 logs portfolio-backend --lines 10 --err

echo -e "\n3️⃣ Checking NGINX configuration..."
sudo nginx -t
if [ $? -eq 0 ]; then
    echo "✅ NGINX configuration is valid"
else
    echo "❌ NGINX configuration has errors"
fi

echo -e "\n4️⃣ Testing upload endpoint directly..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:5000/api/upload/test

echo -e "\n5️⃣ Checking file permissions..."
ls -la /var/www/portfolio/backend/uploads/
ls -la /var/www/portfolio/backend/uploads/art/

echo -e "\n6️⃣ Testing static file serving..."
if [ -f "/var/www/portfolio/backend/uploads/art/art-1754705630284-150928017.jpg" ]; then
    echo "File exists on filesystem"
    curl -s -o /dev/null -w "NGINX Status: %{http_code}\n" https://boussettahsalah.online/uploads/art/art-1754705630284-150928017.jpg
else
    echo "File does not exist on filesystem"
fi

echo -e "\n7️⃣ Checking disk space..."
df -h /var/www/portfolio/backend/uploads/

echo -e "\n🔧 Quick Fix Commands:"
echo "If NGINX config is outdated:"
echo "  sudo cp /var/www/portfolio/nginx.conf /etc/nginx/sites-available/portfolio"
echo "  sudo nginx -t && sudo systemctl reload nginx"
echo ""
echo "If permissions are wrong:"
echo "  sudo chown -R www-data:www-data /var/www/portfolio/backend/uploads"
echo "  sudo chmod -R 755 /var/www/portfolio/backend/uploads"
echo ""
echo "If backend is crashing:"
echo "  pm2 restart portfolio-backend"
echo "  pm2 logs portfolio-backend --lines 20"