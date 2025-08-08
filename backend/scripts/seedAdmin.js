require('dotenv').config();
const { Admin } = require('../models');

const seedAdmin = async () => {
  try {
    console.log('👤 Seeding admin user...');

    // Connect to database
    const { sequelize } = require('../config/database');
    await sequelize.authenticate();
    console.log('📡 Database connected successfully');

    // Create default admin
    await Admin.createDefaultAdmin();
    
    console.log('✅ Admin seeding completed!');
  } catch (error) {
    console.error('❌ Admin seeding failed:', error);
    throw error;
  } finally {
    const { sequelize } = require('../config/database');
    await sequelize.close();
  }
};

// Run if called directly
if (require.main === module) {
  seedAdmin()
    .then(() => {
      console.log('🎉 Admin seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Admin seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = seedAdmin;