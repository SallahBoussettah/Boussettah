require('dotenv').config();
const { sequelize, initializeModels } = require('../models');

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync all models (create tables)
    await sequelize.sync({ force: false });
    console.log('✅ Database tables synchronized successfully.');
    
    // Initialize models (create default admin)
    await initializeModels();
    console.log('✅ Models initialized successfully.');
    
    console.log('🎉 Database initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();