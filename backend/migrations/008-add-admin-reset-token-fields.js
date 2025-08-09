const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🔐 Adding password reset token fields to admins table...');
    
    try {
      // Add reset_token column (snake_case to match PostgreSQL conventions)
      await queryInterface.addColumn('admins', 'reset_token', {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Temporary token for password reset verification'
      });
      console.log('✅ Added reset_token column');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  reset_token column already exists, skipping');
      } else {
        throw error;
      }
    }

    try {
      // Add reset_token_expiry column (snake_case to match PostgreSQL conventions)
      await queryInterface.addColumn('admins', 'reset_token_expiry', {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Expiration time for password reset token'
      });
      console.log('✅ Added reset_token_expiry column');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  reset_token_expiry column already exists, skipping');
      } else {
        throw error;
      }
    }

    // Clean up any old camelCase columns if they exist (for migration from old versions)
    try {
      const tableDescription = await queryInterface.describeTable('admins');
      
      if (tableDescription.resetToken) {
        console.log('🧹 Found old resetToken column, removing...');
        await queryInterface.removeColumn('admins', 'resetToken');
        console.log('✅ Removed old resetToken column');
      }
      
      if (tableDescription.resetTokenExpiry) {
        console.log('🧹 Found old resetTokenExpiry column, removing...');
        await queryInterface.removeColumn('admins', 'resetTokenExpiry');
        console.log('✅ Removed old resetTokenExpiry column');
      }
    } catch (error) {
      console.log('⚠️  No old camelCase columns found to clean up');
    }

    console.log('🎉 Password reset token fields migration completed!');
  },

  down: async (queryInterface, Sequelize) => {
    console.log('🔄 Removing password reset token fields from admins table...');
    
    try {
      await queryInterface.removeColumn('admins', 'reset_token');
      console.log('✅ Removed reset_token column');
    } catch (error) {
      console.log('⚠️  reset_token column not found');
    }

    try {
      await queryInterface.removeColumn('admins', 'reset_token_expiry');
      console.log('✅ Removed reset_token_expiry column');
    } catch (error) {
      console.log('⚠️  reset_token_expiry column not found');
    }

    console.log('✅ Password reset token fields rollback completed!');
  }
};