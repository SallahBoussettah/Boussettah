#!/bin/bash

# Update script for production

echo "🔄 Updating application..."

# Pull latest changes
git pull origin main

# Rebuild and restart services
docker-compose build
docker-compose up -d

# Run any new migrations
docker-compose exec backend npm run migrate

echo "✅ Update completed!"