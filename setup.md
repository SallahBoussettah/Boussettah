# Portfolio Setup Guide

This guide will help you set up both the frontend and backend of your portfolio website.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Quick Setup

### 1. Database Setup

First, create a PostgreSQL database:

```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH PASSWORD 'SATOSANb6';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
```

Or use your existing postgres user with the password `SATOSANb6` as configured.

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Initialize database (creates tables and default admin)
node scripts/init-db.js

# Start the backend server
npm run dev
```

The backend will be running on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will be running on `http://localhost:3000`

## Default Admin Credentials

- **Email**: `dev@boussettahsalah.online`
- **Password**: `SalahDev`

You can access the admin dashboard at `http://localhost:3000/login`

## Password Recovery

If you forget your password, you have several options:

### Option 1: Web Interface
Visit `http://localhost:3000/reset-password` and use your email to reset the password.

### Option 2: Command Line Tool
```bash
cd backend
npm run reset-password
```

### Option 3: Direct API Call
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@boussettahsalah.online",
    "newPassword": "your_new_password",
    "confirmPassword": "your_new_password"
  }'
```

## API Endpoints

The backend provides the following endpoints:

### Authentication
- `POST /api/auth/login` - Login with password
- `GET /api/auth/verify` - Verify JWT token
- `PUT /api/auth/change-password` - Change password

### Projects
- `GET /api/projects` - Get all projects (public)
- `GET /api/projects/:slug` - Get single project (public)
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Art
- `GET /api/art` - Get all art pieces (public)
- `GET /api/art/:slug` - Get single art piece (public)
- `GET /api/art/admin/all` - Get all art pieces including private (admin)
- `POST /api/art` - Create art piece (admin)
- `PUT /api/art/:id` - Update art piece (admin)
- `DELETE /api/art/:id` - Delete art piece (admin)

## Features

### Backend Features
- ✅ JWT Authentication
- ✅ PostgreSQL Database with Sequelize ORM
- ✅ Rate Limiting & Security
- ✅ Input Validation
- ✅ CORS Configuration
- ✅ Auto-generated slugs
- ✅ View/Like counters
- ✅ Featured content support

### Frontend Features
- ✅ Next.js 15 with TypeScript
- ✅ Beautiful UI with Tailwind CSS & Framer Motion
- ✅ Dark/Light theme support
- ✅ Protected admin routes
- ✅ JWT token management
- ✅ Real-time authentication state
- ✅ Responsive design

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASSWORD=SATOSANb6
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
ADMIN_PASSWORD=SalahDev
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Database Connection Issues
1. Make sure PostgreSQL is running
2. Check if the database `portfolio_db` exists
3. Verify the username and password in the `.env` file
4. Ensure the user has proper permissions

### Port Conflicts
- Backend runs on port 5000
- Frontend runs on port 3000
- Make sure these ports are available

### Authentication Issues
1. Make sure the backend is running before trying to login
2. Check browser console for any API errors
3. Verify the JWT token is being stored in localStorage

## Next Steps

1. **Customize the design** - The frontend design is already complete and beautiful
2. **Add your content** - Use the admin dashboard to add your projects and art
3. **Deploy** - Deploy both frontend and backend to your preferred hosting service
4. **Domain setup** - Update CORS settings for your production domain

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Update database credentials for production
4. Configure CORS for your production domain
5. Use PM2 or similar for process management

### Frontend
1. Update `NEXT_PUBLIC_API_URL` to your production API URL
2. Build and deploy using Vercel, Netlify, or similar
3. Ensure environment variables are set in your hosting platform

Your portfolio is now ready! 🎉