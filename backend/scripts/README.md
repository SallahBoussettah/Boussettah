# Database Scripts

This directory contains essential scripts for database management and seeding.

## 🏗️ Database Management Scripts

### `createTables.js`
Creates all database tables using migrations.
```bash
node scripts/createTables.js
```

### `resetDatabase.js`
**⚠️ DANGER**: Completely wipes the database, removing all tables, data, ENUMs, and sequences.
```bash
node scripts/resetDatabase.js
```

## 🌱 Seeding Scripts

### Individual Seeding Scripts

#### `seedAdmin.js`
Creates the default admin user.
```bash
node scripts/seedAdmin.js
```

#### `seedProjects.js`
Seeds sample project data (5 projects with complete information).
```bash
node scripts/seedProjects.js
```

#### `seedArt.js`
Seeds sample art pieces (5 artworks with metadata).
```bash
node scripts/seedArt.js
```

#### `seedEducation.js`
Seeds sample education entries (3 educational backgrounds).
```bash
node scripts/seedEducation.js
```

#### `seedExperience.js`
Seeds sample work experience (4 job experiences).
```bash
node scripts/seedExperience.js
```

### Master Seeding Script

#### `seedAll.js`
Runs all seeding scripts in the correct order.
```bash
node scripts/seedAll.js
```

## 🚀 Quick Setup Guide

### For a Fresh Database:
```bash
# 1. Create all tables
node scripts/createTables.js

# 2. Seed all data
node scripts/seedAll.js
```

### For Existing Database Reset:
```bash
# 1. Reset everything (⚠️ DESTRUCTIVE)
node scripts/resetDatabase.js

# 2. Recreate tables
node scripts/createTables.js

# 3. Seed all data
node scripts/seedAll.js
```

## 📊 Sample Data Overview

### Admin User
- **Username**: admin
- **Password**: SalahDev (or from ADMIN_PASSWORD env var)
- **Email**: dev@boussettahsalah.online (or from ADMIN_EMAIL env var)

### Projects (5 samples)
- E-Commerce Platform (Web, Completed)
- Task Management App (Web, Completed)
- Mobile Weather App (Mobile, Completed)
- 2D Platformer Game (Game, In Progress)
- Portfolio Website (Web, Completed)

### Art Pieces (5 samples)
- Sakura Warrior (Character Portrait)
- Cyberpunk Cityscape (Landscape)
- Abstract Flow (Abstract)
- Dragon Concept (Concept Art)
- Pixel Adventure (Pixel Art)

### Education (3 samples)
- Master's in Computer Science
- Bachelor's in Information Technology
- Digital Art Certification

### Experience (4 samples)
- Senior Full Stack Developer (Current)
- Game Developer
- Frontend Developer
- Digital Artist (Freelance, Current)

## ⚠️ Important Notes

1. **Environment Variables**: Make sure your `.env` file is properly configured with database credentials.

2. **Destructive Operations**: The `resetDatabase.js` script will permanently delete all data. Use with caution.

3. **Seeding Order**: The `seedAll.js` script runs seeders in the correct order to avoid dependency issues.

4. **Database Connection**: All scripts automatically handle database connections and cleanup.

5. **Error Handling**: Scripts will exit with appropriate error codes and messages if something goes wrong.

## 🔧 Script Features

- ✅ **Environment Variable Support**: All scripts load `.env` automatically
- ✅ **Database Connection Management**: Automatic connection and cleanup
- ✅ **Error Handling**: Proper error reporting and exit codes
- ✅ **Progress Logging**: Clear progress indicators and success messages
- ✅ **Data Validation**: Sample data follows model constraints
- ✅ **Idempotent Operations**: Safe to run multiple times