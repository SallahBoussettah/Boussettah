#!/bin/bash

# Production deployment script for Oracle Cloud VPS (without Docker)

echo "🚀 Starting deployment process..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "🔧 Installing required packages..."
sudo apt install -y nginx postgresql postgresql-contrib git certbot python3-certbot-nginx curl

# Install Node.js 18 LTS
echo "📦 Installing Node.js 18 LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "🔧 Installing PM2..."
sudo npm install -g pm2

# Clone repository (if not already cloned)
if [ ! -d "/var/www/portfolio" ]; then
    echo "📥 Cloning repository..."
    sudo git clone https://github.com/yourusername/portfolio.git /var/www/portfolio
    sudo chown -R $USER:$USER /var/www/portfolio
fi

# Navigate to project directory
cd /var/www/portfolio

# Copy production environment files
echo "⚙️ Setting up environment files..."
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env.local

# Set up database
echo "🗄️ Setting up PostgreSQL database..."
sudo -u postgres createdb portfolio_db 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_production_db_password_here';" 2>/dev/null || echo "Password already set"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --production
cd ..

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies and building..."
cd frontend
npm install
npm run build
cd ..

# Create uploads directory
mkdir -p backend/uploads

# Run database migrations
echo "🔄 Running database migrations..."
cd backend
npm run migrate
cd ..

# Start applications with PM2
echo "🚀 Starting applications with PM2..."
pm2 delete all 2>/dev/null || echo "No existing PM2 processes"

# Start backend
cd backend
pm2 start npm --name "portfolio-backend" -- start
cd ..

# Start frontend
cd frontend
pm2 start npm --name "portfolio-frontend" -- start
cd ..

# Save PM2 configuration
pm2 save
pm2 startup

# Set up Nginx
echo "🌐 Setting up Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/boussettahsalah.online
sudo ln -sf /etc/nginx/sites-available/boussettahsalah.online /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Get SSL certificate
echo "🔒 Setting up SSL certificate..."
sudo certbot --nginx -d boussettahsalah.online -d www.boussettahsalah.online --non-interactive --agree-tos --email dev@boussettahsalah.online

# Start and enable services
echo "🔄 Starting services..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Set up automatic SSL renewal
echo "🔄 Setting up SSL auto-renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Set up log rotation
echo "📝 Setting up log rotation..."
sudo tee /etc/logrotate.d/portfolio > /dev/null <<EOF
/var/www/portfolio/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF

# Create logs directory
mkdir -p /var/www/portfolio/logs

echo "✅ Deployment completed successfully!"
echo "🌐 Your site should be available at: https://boussettahsalah.online"
echo ""
echo "📋 Next steps:"
echo "1. Update the database password in backend/.env"
echo "2. Update the JWT secret in backend/.env"
echo "3. Update the admin password in backend/.env"
echo "4. Restart the services: pm2 restart all"
echo ""
echo "🔧 Useful commands:"
echo "- View logs: pm2 logs"
echo "- Restart services: pm2 restart all"
echo "- View status: pm2 status"
echo "- Update code: git pull && ./update.sh"