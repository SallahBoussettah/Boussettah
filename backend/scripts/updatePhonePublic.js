require('dotenv').config();
const { Settings } = require('../models');

const updatePhonePublic = async () => {
  try {
    console.log('🔄 Updating contact_phone to be public...');
    
    const setting = await Settings.findOne({ where: { key: 'contact_phone' } });
    
    if (setting) {
      await setting.update({ isPublic: true });
      console.log('✅ contact_phone is now public');
      console.log(`Phone number: ${setting.value}`);
    } else {
      console.log('❌ contact_phone setting not found');
    }
    
  } catch (error) {
    console.error('❌ Error updating phone setting:', error);
    throw error;
  }
};

// Run if this file is executed directly
if (require.main === module) {
  const { sequelize } = require('../config/database');
  
  sequelize.authenticate()
    .then(() => {
      console.log('✅ Database connection established');
      return updatePhonePublic();
    })
    .then(() => {
      console.log('🎉 Phone setting update completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Phone setting update failed:', error);
      process.exit(1);
    });
}

module.exports = { updatePhonePublic };