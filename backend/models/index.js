const { sequelize } = require('../config/database');
const Admin = require('./Admin');
const Project = require('./Project');
const Art = require('./Art');

// Initialize models and create default admin
const initializeModels = async () => {
  try {
    // Sync all models
    await sequelize.sync({ force: false });
    
    // Create default admin
    await Admin.createDefaultAdmin();
    
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
  initializeModels
};