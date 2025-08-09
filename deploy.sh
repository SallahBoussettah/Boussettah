#!/bin/bash

echo "🚀 Deploying Portfolio Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Stop existing PM2 processes
print_status "Stopping existing PM2 processes..."
pm2 stop all
pm2 delete all

# Update NGINX configuration
print_status "Updating NGINX configuration..."
sudo cp nginx.conf /etc/nginx/sites-available/portfolio
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    print_status "NGINX configuration updated successfully"
else
    print_error "NGINX configuration test failed"
    exit 1
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install --production
cd ..

# Build and install frontend
print_status "Building frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

# Set proper permissions for uploads
print_status "Setting upload directory permissions..."
sudo chown -R www-data:www-data /var/www/portfolio/backend/uploads
sudo chmod -R 755 /var/www/portfolio/backend/uploads

# Copy static files for standalone mode
print_status "Setting up standalone frontend..."
cp -r frontend/public frontend/.next/standalone/
cp -r frontend/.next/static frontend/.next/standalone/.next/

# Start applications with PM2
print_status "Starting applications with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup

print_status "Deployment completed!"
print_status "Backend running on port 5000"
print_status "Frontend running on port 3000"
print_status "NGINX proxying from https://boussettahsalah.online"

echo ""
print_warning "Check logs with: pm2 logs"
print_warning "Check status with: pm2 status"
print_warning "Monitor with: pm2 monit"