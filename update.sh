#!/bin/bash

# Update script for production (without Docker)

echo "🔄 Updating application..."

# Pull latest changes
git pull origin main

# Stop PM2 processes
pm2 stop all

# Update backend dependencies
echo "📦 Updating backend..."
cd backend
npm install --production
cd ..

# Update frontend and rebuild
echo "📦 Updating frontend..."
cd frontend
npm install
npm run build
cd ..

# Run any new migrations
echo "🔄 Running migrations..."
cd backend
npm run migrate
cd ..

# Restart PM2 processes
pm2 restart all

echo "✅ Update completed!"
echo "🔧 Check status: pm2 status"