# Production Deployment Guide

This guide will help you deploy the portfolio application to Oracle Cloud VPS with nginx and SSL.

## Prerequisites

- Oracle Cloud VPS with Ubuntu/Debian
- Domain name pointed to your VPS IP (boussettahsalah.online)
- SSH access to your VPS

## Quick Deployment

1. **Connect to your VPS:**

   ```bash
   ssh ubuntu@your-vps-ip
   ```

2. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

3. **Run the deployment script:**

   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Update environment variables:**

   ```bash
   nano backend/.env.production
   ```

   Update the following:

   - `DB_PASSWORD`: Set a secure database password
   - `JWT_SECRET`: Set a long, random JWT secret
   - `ADMIN_PASSWORD`: Set a secure admin password

5. **Restart services:**
   ```bash
   docker-compose restart
   ```

## Manual Deployment Steps

### 1. System Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx postgresql postgresql-contrib nodejs npm git certbot python3-certbot-nginx

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

### 2. Database Setup

```bash
# Create database
sudo -u postgres createdb portfolio_db
sudo -u postgres psql -c "ALTER USER portfolio_user PASSWORD 'your_secure_password';"
```

### 3. Application Setup

```bash
# Clone repository
git clone https://github.com/yourusername/portfolio.git /var/www/portfolio
cd /var/www/portfolio

# Set up environment files
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env.local

# Update environment variables (important!)
nano backend/.env
```

### 4. Application Setup

```bash
# Install backend dependencies
cd backend
npm install --production
cd ..

# Install frontend dependencies and build
cd frontend
npm install
npm run build
cd ..

# Run database migrations
cd backend
npm run migrate
cd ..

# Start applications with PM2
pm2 start backend/server.js --name "portfolio-backend"
cd frontend && pm2 start npm --name "portfolio-frontend" -- start && cd ..

# Save PM2 configuration
pm2 save
pm2 startup
```

### 5. Nginx Setup

```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/boussettahsalah.online
sudo ln -s /etc/nginx/sites-available/boussettahsalah.online /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### 6. SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d boussettahsalah.online -d www.boussettahsalah.online

# Set up auto-renewal
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
```

## Environment Variables

### Backend (.env.production)

```env
NODE_ENV=production
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=your_secure_db_password

# JWT Configuration
JWT_SECRET=your_very_long_and_secure_jwt_secret
JWT_EXPIRES_IN=7d

# Admin Configuration
ADMIN_EMAIL=dev@boussettahsalah.online
ADMIN_PASSWORD=your_secure_admin_password

# SMTP Configuration
SMTP_EMAIL=boussettah.dev@gmail.com
SMTP_APP_PASSWORD=your_google_app_password

# Production Domain
DOMAIN=boussettahsalah.online
FRONTEND_URL=https://boussettahsalah.online
BACKEND_URL=https://boussettahsalah.online/api
```

### Frontend (.env.production)

```env
NEXT_PUBLIC_API_URL=https://boussettahsalah.online/api
NEXT_PUBLIC_DOMAIN=boussettahsalah.online
NODE_ENV=production
```

## Useful Commands

### Docker Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Rebuild and restart
docker-compose build && docker-compose up -d
```

### Database Commands

```bash
# Access database
docker-compose exec postgres psql -U postgres -d portfolio_db

# Run migrations
docker-compose exec backend npm run migrate

# Backup database
docker-compose exec postgres pg_dump -U postgres portfolio_db > backup.sql
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx

# View nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Updating the Application

```bash
# Pull latest changes
git pull origin main

# Update and restart
./update.sh
```

## Troubleshooting

### Check Service Status

```bash
docker-compose ps
sudo systemctl status nginx
```

### View Logs

```bash
# Application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Common Issues

1. **Port already in use**: Stop conflicting services or change ports
2. **Permission denied**: Check file permissions and ownership
3. **SSL certificate issues**: Ensure domain points to your server IP
4. **Database connection**: Verify database credentials and service status

## Security Considerations

1. **Firewall**: Configure UFW to only allow necessary ports (80, 443, 22)
2. **SSH**: Disable password authentication, use key-based auth only
3. **Database**: Use strong passwords and restrict access
4. **Updates**: Keep system and dependencies updated regularly
5. **Backups**: Set up regular database and file backups

## Monitoring

Set up monitoring for:

- Application uptime
- Database performance
- SSL certificate expiration
- Disk space usage
- Memory and CPU usage

## Support

For issues or questions, contact: dev@boussettahsalah.online
