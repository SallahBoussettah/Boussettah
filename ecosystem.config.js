module.exports = {
  apps: [
    {
      name: 'portfolio-backend',
      script: './start-backend.js',
      cwd: '/var/www/portfolio',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/home/ubuntu/.pm2/logs/portfolio-backend-error.log',
      out_file: '/home/ubuntu/.pm2/logs/portfolio-backend-out.log',
      log_file: '/home/ubuntu/.pm2/logs/portfolio-backend.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'portfolio-frontend',
      script: './frontend/.next/standalone/server.js',
      cwd: '/var/www/portfolio',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0'
      },
      error_file: '/home/ubuntu/.pm2/logs/portfolio-frontend-error.log',
      out_file: '/home/ubuntu/.pm2/logs/portfolio-frontend-out.log',
      log_file: '/home/ubuntu/.pm2/logs/portfolio-frontend.log',
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};