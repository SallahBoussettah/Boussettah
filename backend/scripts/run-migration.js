const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

async function runMigration() {
  try {
    console.log('🔄 Running migration to add reset token fields...');
    
    // Add resetToken column
    await sequelize.getQueryInterface().addColumn('admins', 'resetToken', {
      type: DataTypes.STRING,
      allowNull: true
    });
    
    // Add resetTokenExpiry column
    await sequelize.getQueryInterface().addColumn('admins', 'resetTokenExpiry', {
      type: DataTypes.DATE,
      allowNull: true
    });
    
    console.log('✅ Migration completed successfully!');
    console.log('📧 Password reset with email verification is now available');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Migration already applied - columns exist');
    } else {
      console.error('❌ Migration failed:', error.message);
    }
  } finally {
    await sequelize.close();
  }
}

runMigration();