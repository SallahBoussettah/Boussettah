const { Settings } = require('../models');

const seedSettings = async () => {
  try {
    console.log('🌱 Seeding settings...');
    
    await Settings.createDefaultSettings();
    
    console.log('✅ Settings seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  const { sequelize } = require('../config/database');
  
  sequelize.authenticate()
    .then(() => {
      console.log('✅ Database connection established');
      return seedSettings();
    })
    .then(() => {
      console.log('🎉 Settings seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Settings seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedSettings };