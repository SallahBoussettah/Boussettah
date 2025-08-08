# Database Migrations

This directory contains all database migrations for the Portfolio project.

## Migration Files

### 001-create-admins-table.js
Creates the `admins` table for authentication system.

**Fields:**
- `id` - Primary key, auto-increment
- `username` - Unique username (default: 'admin')
- `password` - Hashed password
- `email` - Admin email address
- `last_login` - Last login timestamp
- `is_active` - Active status flag
- `created_at`, `updated_at` - Timestamps

**Indexes:**
- username, email, is_active

### 002-create-projects-table.js
Creates the `projects` table for project portfolio.

**Fields:**
- `id` - Primary key, auto-increment
- `title` - Project title (required)
- `subtitle` - Project subtitle
- `slug` - URL-friendly identifier (unique)
- `description` - Project description
- `long_description` - Detailed description
- `short_description` - Brief description (500 chars)
- `category` - ENUM: web, mobile, game, desktop
- `status` - ENUM: planning, in-progress, completed, on-hold
- `technologies` - Array of technology names
- `github_url` - GitHub repository URL
- `live_url` - Live demo URL
- `demo_url` - Demo video URL
- `image_url` - Main project image
- `thumbnail_url` - Thumbnail image
- `images` - Array of additional images
- `features` - Array of key features
- `challenges` - Array of challenges faced
- `learnings` - Array of lessons learned
- `featured` - Featured project flag
- `priority` - Display priority (integer)
- `year` - Project year (4 digits)
- `start_date` - Project start date
- `end_date` - Project end date
- `views` - View count
- `likes` - Like count
- `stars` - GitHub stars count
- `downloads` - Download count
- `is_public` - Public visibility flag
- `completion_percentage` - Progress percentage (0-100)
- `difficulty` - ENUM: beginner, intermediate, advanced
- `team_size` - Number of team members
- `duration` - Project duration
- `client` - Client name
- `awards` - Array of awards received
- `tags` - Array of tags
- `created_at`, `updated_at` - Timestamps

**Indexes:**
- category, status, featured, is_public, year, priority, views, likes, created_at, slug

### 003-create-art-pieces-table.js
Creates the `art_pieces` table for art gallery.

**Fields:**
- `id` - Primary key, auto-increment
- `title` - Artwork title (required)
- `slug` - URL-friendly identifier (unique)
- `description` - Artwork description
- `category` - ENUM: Digital Art, Character Portrait, Abstract, Landscape, Concept Art, Illustration, Pixel Art
- `medium` - Art medium (default: 'Paint Studio on PC')
- `year` - Creation year
- `image_url` - Main artwork image
- `thumbnail_url` - Thumbnail image
- `images` - Array of additional images
- `featured` - Featured artwork flag
- `priority` - Display priority
- `dimensions` - Artwork dimensions
- `tags` - Array of tags
- `views` - View count
- `likes` - Like count
- `is_public` - Public visibility flag
- `created_year` - Creation year as integer
- `created_at`, `updated_at` - Timestamps

**Indexes:**
- category, featured, is_public, year, created_year, priority, views, likes, created_at, slug

### 004-create-education-table.js
Creates the `education` table for educational background.

**Fields:**
- `id` - Primary key, auto-increment
- `degree` - Degree name (required)
- `school` - Institution name (required)
- `year` - Year or period (required)
- `description` - Education description
- `icon` - ENUM: Award, Code, Palette, Book, Certificate, GraduationCap
- `order` - Display order
- `is_active` - Active status flag
- `created_at`, `updated_at` - Timestamps

**Indexes:**
- is_active, order, created_at, school, degree, year

### 005-create-experiences-table.js
Creates the `experiences` table for work experience.

**Fields:**
- `id` - Primary key, auto-increment
- `title` - Job title (required)
- `company` - Company name (required)
- `period` - Time period (required)
- `location` - Work location
- `description` - Role description
- `achievements` - Array of achievements
- `order` - Display order
- `is_active` - Active status flag
- `is_current` - Current position flag
- `created_at`, `updated_at` - Timestamps

**Indexes:**
- is_active, is_current, order, created_at, company, title

## Running Migrations

### Check Database Structure
```bash
node scripts/checkDatabaseStructure.js
```

### Run All Migrations
```bash
node scripts/runMigrations.js
```

### Reset Migration History (for existing databases)
```bash
node scripts/resetAndRunAllMigrations.js
```

## Migration Status

All migrations have been executed and marked as completed:
1. ✅ 001-create-admins-table.js
2. ✅ 002-create-projects-table.js
3. ✅ 003-create-art-pieces-table.js
4. ✅ 004-create-education-table.js
5. ✅ 005-create-experiences-table.js

## Database Schema Summary

**Total Tables:** 7
- `admins` - Authentication system
- `projects` - Project portfolio
- `art_pieces` - Art gallery
- `education` - Educational background
- `experiences` - Work experience
- `SequelizeMeta` - Migration tracking
- `migrations` - Legacy migration table

**Features:**
- ✅ Complete CRUD operations for all entities
- ✅ Proper indexing for performance
- ✅ Data validation and constraints
- ✅ ENUM types for controlled values
- ✅ Array fields for flexible data storage
- ✅ Timestamp tracking
- ✅ Soft delete capabilities (is_active flags)
- ✅ Display ordering (order, priority fields)
- ✅ Public/private visibility controls