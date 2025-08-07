# Portfolio Backend API

A Node.js/Express backend API for the portfolio website with PostgreSQL database and JWT authentication.

## Features

- **Authentication**: JWT-based admin authentication
- **Projects Management**: CRUD operations for portfolio projects
- **Art Gallery**: CRUD operations for art pieces
- **Database**: PostgreSQL with Sequelize ORM
- **Security**: Rate limiting, CORS, helmet, input validation
- **API Documentation**: RESTful API endpoints

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone and navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Database Setup**

   - Create a PostgreSQL database named `portfolio_db`
   - Update database credentials in `.env` file

4. **Environment Configuration**

   - Copy `.env.example` to `.env` (if exists) or use the existing `.env`
   - Update the following variables:
     ```env
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=portfolio_db
     DB_USER=postgres
     DB_PASSWORD=your_password
     JWT_SECRET=your_super_secret_jwt_key
     ADMIN_PASSWORD=SalahDev
     ```

5. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout (optional)
- `PUT /api/auth/change-password` - Change admin password

### Projects (Public)

- `GET /api/projects` - Get all projects
- `GET /api/projects/:slug` - Get project by slug
- `POST /api/projects/:id/like` - Like a project

### Projects (Admin)

- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Art (Public)

- `GET /api/art` - Get all public art pieces
- `GET /api/art/:slug` - Get art piece by slug
- `POST /api/art/:id/like` - Like an art piece

### Art (Admin)

- `GET /api/art/admin/all` - Get all art pieces (including private)
- `POST /api/art` - Create new art piece
- `PUT /api/art/:id` - Update art piece
- `DELETE /api/art/:id` - Delete art piece

### Health Check

- `GET /api/health` - Server health status

## Database Schema

### Admin Table

- `id` (Primary Key)
- `username` (Default: 'admin')
- `password` (Hashed)
- `email`
- `lastLogin`
- `isActive`

### Projects Table

- `id` (Primary Key)
- `title`
- `slug` (Auto-generated from title)
- `description`
- `shortDescription`
- `category` (web, mobile, game, desktop)
- `status` (planning, in-progress, completed, on-hold)
- `technologies` (Array)
- `githubUrl`
- `liveUrl`
- `imageUrl`
- `images` (Array)
- `featured` (Boolean)
- `priority`
- `startDate`
- `endDate`
- `views`
- `likes`

### Art Table

- `id` (Primary Key)
- `title`
- `slug` (Auto-generated from title)
- `description`
- `category` (Digital Art, Character Portrait, etc.)
- `medium`
- `year`
- `imageUrl`
- `thumbnailUrl`
- `images` (Array)
- `featured` (Boolean)
- `priority`
- `dimensions`
- `tags` (Array)
- `views`
- `likes`
- `isPublic` (Boolean)
- `createdYear`

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Login Rate Limiting**: 5 login attempts per 15 minutes per IP
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: Express-validator for request validation
- **Password Hashing**: bcryptjs with salt rounds of 12
- **JWT**: Secure token-based authentication

## Default Admin Account

- **Username**: admin
- **Email**: dev@boussettahsalah.online (configurable via ADMIN_EMAIL env var)
- **Password**: SalahDev (configurable via ADMIN_PASSWORD env var)

The default admin account is created automatically when the server starts.

## Password Recovery

### Web Interface

- Visit `/reset-password` page on your frontend
- Enter your admin email and new password

### Command Line Tool

```bash
npm run reset-password
```

### API Endpoint

```bash
POST /api/auth/reset-password
{
  "email": "dev@boussettahsalah.online",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

## Development

```bash
# Install nodemon for development
npm install -g nodemon

# Run in development mode
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Update CORS origins in server.js
3. Use a strong JWT_SECRET
4. Configure proper database credentials
5. Set up SSL/HTTPS
6. Use a process manager like PM2

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists and user has proper permissions

### Authentication Issues

- Check JWT_SECRET is set
- Verify token is being sent in Authorization header as `Bearer <token>`
- Check token expiration (default: 7 days)

### CORS Issues

- Update CORS origins in `server.js` for your frontend domain
- Ensure credentials are included in frontend requests if needed
