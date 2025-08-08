const express = require('express');
const { body, validationResult } = require('express-validator');
const { Settings } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all public settings (for frontend consumption)
router.get('/public', async (req, res) => {
  try {
    const settings = await Settings.getAllSettings(false);
    
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get settings by category (public)
router.get('/public/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const settings = await Settings.getByCategory(category, false);
    
    res.json({
      success: true,
      category,
      settings
    });
  } catch (error) {
    console.error('Error fetching category settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category settings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get all settings (admin only - includes private settings)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const settings = await Settings.findAll({
      order: [['category', 'ASC'], ['key', 'ASC']]
    });
    
    const categorizedSettings = {};
    settings.forEach(setting => {
      if (!categorizedSettings[setting.category]) {
        categorizedSettings[setting.category] = [];
      }
      categorizedSettings[setting.category].push({
        id: setting.id,
        key: setting.key,
        value: setting.getParsedValue(),
        rawValue: setting.value,
        type: setting.type,
        category: setting.category,
        description: setting.description,
        isPublic: setting.isPublic,
        isEditable: setting.isEditable,
        createdAt: setting.createdAt,
        updatedAt: setting.updatedAt
      });
    });
    
    res.json({
      success: true,
      settings: categorizedSettings
    });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get settings by category (admin)
router.get('/admin/:category', authenticateToken, async (req, res) => {
  try {
    const { category } = req.params;
    const settings = await Settings.findAll({
      where: { category },
      order: [['key', 'ASC']]
    });
    
    const formattedSettings = settings.map(setting => ({
      id: setting.id,
      key: setting.key,
      value: setting.getParsedValue(),
      rawValue: setting.value,
      type: setting.type,
      category: setting.category,
      description: setting.description,
      isPublic: setting.isPublic,
      isEditable: setting.isEditable,
      createdAt: setting.createdAt,
      updatedAt: setting.updatedAt
    }));
    
    res.json({
      success: true,
      category,
      settings: formattedSettings
    });
  } catch (error) {
    console.error('Error fetching admin category settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category settings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Bulk update settings
router.post('/admin/bulk-update', 
  authenticateToken,
  [
    body('settings').isObject().withMessage('Settings must be an object')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { settings } = req.body;
      const results = await Settings.bulkUpdateSettings(settings);
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      
      res.json({
        success: true,
        message: `Updated ${successful.length} settings successfully${failed.length > 0 ? `, ${failed.length} failed` : ''}`,
        results: {
          successful: successful.length,
          failed: failed.length,
          details: results
        }
      });
    } catch (error) {
      console.error('Error bulk updating settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update settings',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// Update a single setting
router.put('/admin/:key', 
  authenticateToken,
  [
    body('value').exists().withMessage('Value is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { key } = req.params;
      const { value, isPublic } = req.body;

      const setting = await Settings.findOne({ where: { key } });
      if (!setting) {
        throw new Error(`Setting with key '${key}' not found`);
      }
      
      if (!setting.isEditable) {
        throw new Error(`Setting '${key}' is not editable`);
      }
      
      // Update value
      setting.setValue(value);
      
      // Update isPublic if provided
      if (isPublic !== undefined) {
        setting.isPublic = Boolean(isPublic);
      }
      
      await setting.save();
      
      res.json({
        success: true,
        message: 'Setting updated successfully',
        setting: {
          id: setting.id,
          key: setting.key,
          value: setting.getParsedValue(),
          rawValue: setting.value,
          type: setting.type,
          category: setting.category,
          description: setting.description,
          isPublic: setting.isPublic,
          isEditable: setting.isEditable,
          updatedAt: setting.updatedAt
        }
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      
      if (error.message.includes('not found') || error.message.includes('not editable')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to update setting',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// Create a new setting (admin only)
router.post('/admin', 
  authenticateToken,
  [
    body('key').notEmpty().withMessage('Key is required'),
    body('value').exists().withMessage('Value is required'),
    body('type').isIn(['string', 'number', 'boolean', 'json', 'array']).withMessage('Invalid type'),
    body('category').isIn(['general', 'social', 'seo', 'appearance', 'contact', 'portfolio']).withMessage('Invalid category')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { key, value, type, category, description, isPublic, isEditable } = req.body;

      // Check if setting already exists
      const existingSetting = await Settings.findOne({ where: { key } });
      if (existingSetting) {
        return res.status(400).json({
          success: false,
          message: 'Setting with this key already exists'
        });
      }

      const setting = await Settings.create({
        key,
        value: type === 'json' || type === 'array' ? JSON.stringify(value) : String(value),
        type,
        category,
        description: description || null,
        isPublic: isPublic !== undefined ? isPublic : true,
        isEditable: isEditable !== undefined ? isEditable : true
      });
      
      res.status(201).json({
        success: true,
        message: 'Setting created successfully',
        setting: {
          id: setting.id,
          key: setting.key,
          value: setting.getParsedValue(),
          rawValue: setting.value,
          type: setting.type,
          category: setting.category,
          description: setting.description,
          isPublic: setting.isPublic,
          isEditable: setting.isEditable,
          createdAt: setting.createdAt,
          updatedAt: setting.updatedAt
        }
      });
    } catch (error) {
      console.error('Error creating setting:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create setting',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// Delete a setting (admin only)
router.delete('/admin/:key', authenticateToken, async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await Settings.findOne({ where: { key } });
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }
    
    if (!setting.isEditable) {
      return res.status(400).json({
        success: false,
        message: 'This setting cannot be deleted'
      });
    }
    
    await setting.destroy();
    
    res.json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting setting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete setting',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Reset settings to default (admin only)
router.post('/admin/reset', authenticateToken, async (req, res) => {
  try {
    // Delete all existing settings
    await Settings.destroy({ where: {} });
    
    // Recreate default settings
    await Settings.createDefaultSettings();
    
    res.json({
      success: true,
      message: 'Settings reset to default successfully'
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset settings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;