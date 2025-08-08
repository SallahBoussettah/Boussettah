# Portfolio Settings System

This guide explains how to use the new dynamic settings system that has been implemented for your portfolio.

## Overview

The settings system allows you to manage all configurable aspects of your portfolio from the admin dashboard, including:

- General site information (name, description, owner details)
- Contact information
- Social media links
- SEO settings (meta tags, keywords)
- Portfolio configuration (pagination, features)
- Appearance settings (colors, themes)

## Backend Implementation

### Database Model

The settings are stored in a `settings` table with the following structure:

- `key`: Unique identifier for the setting
- `value`: The setting value (stored as text)
- `type`: Data type (string, number, boolean, json, array)
- `category`: Grouping category (general, social, seo, etc.)
- `description`: Human-readable description
- `isPublic`: Whether the setting is available to frontend
- `isEditable`: Whether the setting can be modified

### API Endpoints

#### Public Endpoints (No Authentication Required)
- `GET /api/settings/public` - Get all public settings
- `GET /api/settings/public/:category` - Get public settings by category

#### Admin Endpoints (Authentication Required)
- `GET /api/settings/admin/all` - Get all settings (including private)
- `GET /api/settings/admin/:category` - Get settings by category
- `PUT /api/settings/admin/:key` - Update a single setting
- `PUT /api/settings/admin/bulk` - Update multiple settings
- `POST /api/settings/admin` - Create a new setting
- `DELETE /api/settings/admin/:key` - Delete a setting
- `POST /api/settings/admin/reset` - Reset all settings to default

## Frontend Implementation

### Settings Context

The frontend uses React Context to provide settings throughout the application:

```tsx
import { useSettings, useSetting, useSettingsByCategory } from '@/contexts/SettingsContext';

// Get all settings and context
const { settings, loading, error, refreshSettings } = useSettings();

// Get a specific setting with default value
const siteName = useSetting('site_name', 'Default Portfolio');

// Get all settings from a category
const socialSettings = useSettingsByCategory('social');
```

### Admin Dashboard

The admin dashboard provides a comprehensive interface for managing settings:

1. **Categorized View**: Settings are organized by category (General, Contact, Social, SEO, Portfolio, Appearance)
2. **Dynamic Forms**: Form fields are automatically generated based on setting types
3. **Bulk Updates**: Save multiple settings at once
4. **Real-time Validation**: Immediate feedback on changes
5. **Reset Functionality**: Restore default settings

### Using Settings in Components

#### Basic Usage

```tsx
import { useSetting } from '@/contexts/SettingsContext';

function Header() {
  const siteName = useSetting('site_name', 'My Portfolio');
  const ownerName = useSetting('owner_name', 'Developer');
  
  return (
    <header>
      <h1>{siteName}</h1>
      <h2>{ownerName}</h2>
    </header>
  );
}
```

#### Category-based Usage

```tsx
import { useSettingsByCategory } from '@/contexts/SettingsContext';

function SocialLinks() {
  const socialSettings = useSettingsByCategory('social');
  
  return (
    <div>
      {socialSettings.social_github && (
        <a href={socialSettings.social_github}>GitHub</a>
      )}
      {socialSettings.social_linkedin && (
        <a href={socialSettings.social_linkedin}>LinkedIn</a>
      )}
    </div>
  );
}
```

#### SEO Integration

```tsx
import { useSettingsByCategory } from '@/contexts/SettingsContext';

function SEOHead() {
  const seoSettings = useSettingsByCategory('seo');
  
  return (
    <Head>
      <title>{seoSettings.seo_meta_title}</title>
      <meta name="description" content={seoSettings.seo_meta_description} />
      <meta name="keywords" content={seoSettings.seo_keywords?.join(', ')} />
    </Head>
  );
}
```

## Setup Instructions

### 1. Run Database Migration

```bash
cd backend
npm run migrate
```

### 2. Seed Default Settings

```bash
npm run seed-settings
```

### 3. Start the Application

```bash
# Backend
npm run dev

# Frontend (in another terminal)
cd ../frontend
npm run dev
```

## Default Settings

The system comes with pre-configured default settings:

### General Settings
- `site_name`: "SB. Portfolio"
- `site_description`: "Software Developer, Game Developer, and Digital Artist"
- `owner_name`: "Salah Eddine Boussettah"
- `owner_title`: "Full Stack Developer & Digital Artist"

### Contact Settings
- `contact_email`: "dev@boussettahsalah.online"
- `contact_location`: "Algeria"

### Social Links
- `social_github`: "https://github.com/SallahBoussettah"
- `social_linkedin`: "https://linkedin.com/in/salahboussettah"
- `social_twitter`: "https://twitter.com/salahboussettah"

### SEO Settings
- `seo_meta_title`: "Salah Eddine Boussettah - Developer & Artist"
- `seo_meta_description`: "Portfolio of Salah Eddine Boussettah..."
- `seo_keywords`: ["developer", "game development", "digital art", ...]

### Portfolio Settings
- `portfolio_projects_per_page`: 12
- `portfolio_art_per_page`: 16
- `portfolio_show_stats`: true
- `portfolio_enable_likes`: true

### Appearance Settings
- `appearance_primary_color`: "#3b82f6"
- `appearance_secondary_color`: "#64748b"
- `appearance_dark_mode_default`: false

## Customization

### Adding New Settings

1. **Via Admin Dashboard**: Use the "Create Setting" functionality
2. **Via Code**: Add to the default settings in `backend/models/Settings.js`

### Setting Types

- `string`: Text values
- `number`: Numeric values
- `boolean`: True/false values
- `json`: Complex objects
- `array`: Lists of values

### Categories

- `general`: Basic site information
- `contact`: Contact details
- `social`: Social media links
- `seo`: Search engine optimization
- `portfolio`: Portfolio-specific settings
- `appearance`: Visual customization

## Best Practices

1. **Use Descriptive Keys**: Follow the pattern `category_setting_name`
2. **Provide Defaults**: Always provide fallback values when using settings
3. **Cache Settings**: The context automatically caches settings for performance
4. **Validate Input**: Use appropriate form validation in the admin interface
5. **Document Changes**: Keep track of custom settings you add

## Troubleshooting

### Settings Not Loading
- Check if the backend is running
- Verify database connection
- Check browser console for errors

### Settings Not Saving
- Ensure you're authenticated as admin
- Check network requests in browser dev tools
- Verify setting keys are correct

### Default Settings Missing
- Run the seed command: `npm run seed-settings`
- Check database for settings table
- Verify migration ran successfully

## API Examples

### Get Public Settings
```bash
curl http://localhost:5000/api/settings/public
```

### Update Setting (Admin)
```bash
curl -X PUT http://localhost:5000/api/settings/admin/site_name \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"value": "My New Portfolio Name"}'
```

### Bulk Update Settings (Admin)
```bash
curl -X PUT http://localhost:5000/api/settings/admin/bulk \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "site_name": "New Portfolio",
      "contact_email": "new@email.com"
    }
  }'
```

This settings system provides a flexible, scalable way to manage your portfolio configuration without requiring code changes for common customizations.