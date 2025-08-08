const { sequelize } = require('../config/database');
const Admin = require('./Admin');
const Project = require('./Project');
const Art = require('./Art');
const Education = require('./Education');
const Experience = require('./Experience');
const TechStack = require('./TechStack');
const Settings = require('./Settings');

// Initialize models and create default admin
const initializeModels = async () => {
  try {
    // Sync all models
    await sequelize.sync({ force: false });
    
    // Create default admin
    await Admin.createDefaultAdmin();
    
    // Create default settings
    await Settings.createDefaultSettings();
    
    console.log('✅ All models initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing models:', error);
  }
};

module.exports = {
  sequelize,
  Admin,
  Project,
  Art,
  Education,
  Experience,
  TechStack,
  Settings,
  initializeModels
};