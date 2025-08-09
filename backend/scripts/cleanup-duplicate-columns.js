require('dotenv').config();
const { sequelize } = require('../config/database');

async function cleanupDuplicateColumns() {
  try {
    console.log('🧹 Cleaning up duplicate columns...');
    
    // Drop the camelCase columns (we'll keep the snake_case ones)
    try {
      await sequelize.query('ALTER TABLE admins DROP COLUMN IF EXISTS "resetToken"');
      console.log('✅ Dropped resetToken column');
    } catch (error) {
      console.log('⚠️  resetToken column might not exist or already dropped');
    }
    
    try {
      await sequelize.query('ALTER TABLE admins DROP COLUMN IF EXISTS "resetTokenExpiry"');
      console.log('✅ Dropped resetTokenExpiry column');
    } catch (error) {
      console.log('⚠️  resetTokenExpiry column might not exist or already dropped');
    }
    
    // Verify final structure
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'admins' 
      AND table_schema = 'public'
      AND column_name IN ('reset_token', 'reset_token_expiry')
      ORDER BY column_name
    `);
    
    console.log('📋 Reset token columns in database:');
    results.forEach(row => {
      console.log(`  ✅ ${row.column_name}`);
    });
    
    console.log('🎉 Cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    await sequelize.close();
  }
}

cleanupDuplicateColumns();