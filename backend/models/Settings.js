const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('string', 'number', 'boolean', 'json', 'array'),
    allowNull: false,
    defaultValue: 'string'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'general',
    validate: {
      isIn: [['general', 'social', 'seo', 'appearance', 'contact', 'portfolio']]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'isPublic'
  },
  isEditable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'isEditable'
  }
}, {
  tableName: 'settings',
  timestamps: true,
  underscored: false, // Keep camelCase field names
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['key']
    },
    {
      fields: ['category']
    },
    {
      fields: ['isPublic']
    }
  ]
});

// Instance methods
Settings.prototype.getParsedValue = function() {
  if (!this.value) return null;
  
  try {
    switch (this.type) {
      case 'boolean':
        return this.value === 'true' || this.value === true;
      case 'number':
        return parseFloat(this.value);
      case 'json':
        return JSON.parse(this.value);
      case 'array':
        return JSON.parse(this.value);
      default:
        return this.value;
    }
  } catch (error) {
    console.error(`Error parsing setting ${this.key}:`, error);
    return this.value;
  }
};

Settings.prototype.setValue = function(value) {
  try {
    switch (this.type) {
      case 'boolean':
        this.value = Boolean(value).toString();
        break;
      case 'number':
        this.value = Number(value).toString();
        break;
      case 'json':
      case 'array':
        this.value = JSON.stringify(value);
        break;
      default:
        this.value = String(value);
    }
  } catch (error) {
    console.error(`Error setting value for ${this.key}:`, error);
    this.value = String(value);
  }
};

// Static methods
Settings.createDefaultSettings = async () => {
  const defaultSettings = [
    // General Settings
    {
      key: 'site_name',
      value: 'SB. Portfolio',
      type: 'string',
      category: 'general',
      description: 'The name of the portfolio website',
      isPublic: true
    },
    {
      key: 'site_description',
      value: 'Software Developer, Game Developer, and Digital Artist',
      type: 'string',
      category: 'general',
      description: 'Brief description of the portfolio',
      isPublic: true
    },
    {
      key: 'site_tagline',
      value: 'Creating digital experiences through code and art',
      type: 'string',
      category: 'general',
      description: 'Tagline or motto for the portfolio',
      isPublic: true
    },
    {
      key: 'owner_name',
      value: 'Salah Eddine Boussettah',
      type: 'string',
      category: 'general',
      description: 'Full name of the portfolio owner',
      isPublic: true
    },
    {
      key: 'owner_title',
      value: 'Full Stack Developer & Digital Artist',
      type: 'string',
      category: 'general',
      description: 'Professional title',
      isPublic: true
    },
    
    // Contact Settings
    {
      key: 'contact_email',
      value: 'dev@boussettahsalah.online',
      type: 'string',
      category: 'contact',
      description: 'Primary contact email',
      isPublic: true
    },
    {
      key: 'contact_phone',
      value: '',
      type: 'string',
      category: 'contact',
      description: 'Contact phone number',
      isPublic: true
    },
    {
      key: 'contact_location',
      value: 'Morocco',
      type: 'string',
      category: 'contact',
      description: 'Location/City',
      isPublic: true
    },
    
    // Social Links
    {
      key: 'social_github',
      value: 'https://github.com/SallahBoussettah',
      type: 'string',
      category: 'social',
      description: 'GitHub profile URL',
      isPublic: true
    },
    {
      key: 'social_linkedin',
      value: 'https://linkedin.com/in/salahboussettah',
      type: 'string',
      category: 'social',
      description: 'LinkedIn profile URL',
      isPublic: true
    },
    {
      key: 'social_twitter',
      value: 'https://twitter.com/salahboussettah',
      type: 'string',
      category: 'social',
      description: 'Twitter profile URL',
      isPublic: true
    },
    {
      key: 'social_instagram',
      value: '',
      type: 'string',
      category: 'social',
      description: 'Instagram profile URL',
      isPublic: true
    },
    {
      key: 'social_youtube',
      value: '',
      type: 'string',
      category: 'social',
      description: 'YouTube channel URL',
      isPublic: true
    },
    {
      key: 'social_discord',
      value: '',
      type: 'string',
      category: 'social',
      description: 'Discord username or server',
      isPublic: true
    },
    
    // SEO Settings
    {
      key: 'seo_meta_title',
      value: 'Salah Eddine Boussettah - Developer & Artist',
      type: 'string',
      category: 'seo',
      description: 'Meta title for SEO',
      isPublic: true
    },
    {
      key: 'seo_meta_description',
      value: 'Portfolio of Salah Eddine Boussettah - Software Developer, Game Developer, and Digital Artist',
      type: 'string',
      category: 'seo',
      description: 'Meta description for SEO',
      isPublic: true
    },
    {
      key: 'seo_keywords',
      value: JSON.stringify(['developer', 'game development', 'digital art', 'web development', 'full stack', 'react', 'node.js']),
      type: 'array',
      category: 'seo',
      description: 'SEO keywords',
      isPublic: true
    },
    {
      key: 'seo_og_image',
      value: '',
      type: 'string',
      category: 'seo',
      description: 'Open Graph image URL',
      isPublic: true
    },
    
    // Portfolio Settings
    {
      key: 'portfolio_projects_per_page',
      value: '12',
      type: 'number',
      category: 'portfolio',
      description: 'Number of projects to show per page',
      isPublic: false
    },
    {
      key: 'portfolio_art_per_page',
      value: '16',
      type: 'number',
      category: 'portfolio',
      description: 'Number of art pieces to show per page',
      isPublic: false
    },
    {
      key: 'portfolio_show_stats',
      value: 'true',
      type: 'boolean',
      category: 'portfolio',
      description: 'Show portfolio statistics on homepage',
      isPublic: false
    },
    {
      key: 'portfolio_enable_likes',
      value: 'true',
      type: 'boolean',
      category: 'portfolio',
      description: 'Enable like functionality for projects and art',
      isPublic: false
    },
    {
      key: 'portfolio_enable_comments',
      value: 'false',
      type: 'boolean',
      category: 'portfolio',
      description: 'Enable comments (future feature)',
      isPublic: false
    },
    
    // Appearance Settings
    {
      key: 'appearance_primary_color',
      value: '#3b82f6',
      type: 'string',
      category: 'appearance',
      description: 'Primary brand color',
      isPublic: true
    },
    {
      key: 'appearance_secondary_color',
      value: '#64748b',
      type: 'string',
      category: 'appearance',
      description: 'Secondary color',
      isPublic: true
    },
    {
      key: 'appearance_dark_mode_default',
      value: 'false',
      type: 'boolean',
      category: 'appearance',
      description: 'Default to dark mode',
      isPublic: true
    },
    {
      key: 'appearance_show_hero_animation',
      value: 'true',
      type: 'boolean',
      category: 'appearance',
      description: 'Show animated hero section',
      isPublic: true
    },
    {
      key: 'appearance_hero_background',
      value: '',
      type: 'string',
      category: 'appearance',
      description: 'Hero section background image URL',
      isPublic: true
    }
  ];

  try {
    for (const setting of defaultSettings) {
      await Settings.findOrCreate({
        where: { key: setting.key },
        defaults: setting
      });
    }
    console.log('✅ Default settings created successfully');
  } catch (error) {
    console.error('❌ Error creating default settings:', error);
  }
};

Settings.getByCategory = async (category, includePrivate = false) => {
  const whereClause = { category };
  if (!includePrivate) {
    whereClause.isPublic = true;
  }
  
  const settings = await Settings.findAll({
    where: whereClause,
    order: [['key', 'ASC']]
  });
  
  const result = {};
  settings.forEach(setting => {
    result[setting.key] = setting.getParsedValue();
  });
  
  return result;
};

Settings.getAllSettings = async (includePrivate = false) => {
  const whereClause = {};
  if (!includePrivate) {
    whereClause.isPublic = true;
  }
  
  const settings = await Settings.findAll({
    where: whereClause,
    order: [['category', 'ASC'], ['key', 'ASC']]
  });
  
  const result = {};
  settings.forEach(setting => {
    if (!result[setting.category]) {
      result[setting.category] = {};
    }
    result[setting.category][setting.key] = setting.getParsedValue();
  });
  
  return result;
};

Settings.updateSetting = async (key, value) => {
  const setting = await Settings.findOne({ where: { key } });
  if (!setting) {
    throw new Error(`Setting with key '${key}' not found`);
  }
  
  if (!setting.isEditable) {
    throw new Error(`Setting '${key}' is not editable`);
  }
  
  setting.setValue(value);
  await setting.save();
  
  return setting;
};

Settings.bulkUpdateSettings = async (updates) => {
  const results = [];
  
  for (const [key, value] of Object.entries(updates)) {
    try {
      const setting = await Settings.updateSetting(key, value);
      results.push({ key, success: true, setting });
    } catch (error) {
      results.push({ key, success: false, error: error.message });
    }
  }
  
  return results;
};

module.exports = Settings;