#!/bin/bash

# Production deployment script for Oracle Cloud VPS

echo "🚀 Starting deployment process..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "🔧 Installing required packages..."
sudo apt install -y nginx postgresql postgresql-contrib nodejs npm git certbot python3-certbot-nginx

# Install Docker and Docker Compose
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

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

# Build and start services
echo "🏗️ Building and starting services..."
docker-compose down
docker-compose build
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose exec backend npm run migrate

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
sudo systemctl enable docker

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
echo "1. Update the database password in backend/.env.production"
echo "2. Update the JWT secret in backend/.env.production"
echo "3. Update the admin password in backend/.env.production"
echo "4. Restart the services: docker-compose restart"
echo ""
echo "🔧 Useful commands:"
echo "- View logs: docker-compose logs -f"
echo "- Restart services: docker-compose restart"
echo "- Update code: git pull && docker-compose build && docker-compose up -d"