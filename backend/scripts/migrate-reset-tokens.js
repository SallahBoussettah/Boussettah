const { sequelize } = require('../config/database');

async function migrateResetTokens() {
  try {
    console.log('🔐 Migrating admin table for password reset functionality...');
    
    // Check if admins table exists
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'admins'
    `);
    
    if (tables.length === 0) {
      console.log('❌ Admins table does not exist. Please run the main migrations first.');
      return;
    }
    
    // Get current table structure
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'admins' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    const existingColumns = columns.map(col => col.column_name);
    console.log('📋 Current columns:', existingColumns);
    
    // Check what we need to do
    const hasSnakeCase = existingColumns.includes('reset_token') && existingColumns.includes('reset_token_expiry');
    const hasCamelCase = existingColumns.includes('resetToken') && existingColumns.includes('resetTokenExpiry');
    
    if (hasSnakeCase && hasCamelCase) {
      console.log('🧹 Found both camelCase and snake_case columns, cleaning up...');
      
      // Remove camelCase columns
      await sequelize.query('ALTER TABLE admins DROP COLUMN IF EXISTS "resetToken"');
      await sequelize.query('ALTER TABLE admins DROP COLUMN IF EXISTS "resetTokenExpiry"');
      console.log('✅ Removed duplicate camelCase columns');
      
    } else if (hasCamelCase && !hasSnakeCase) {
      console.log('🔄 Converting camelCase columns to snake_case...');
      
      // Rename camelCase to snake_case
      await sequelize.query('ALTER TABLE admins RENAME COLUMN "resetToken" TO reset_token');
      await sequelize.query('ALTER TABLE admins RENAME COLUMN "resetTokenExpiry" TO reset_token_expiry');
      console.log('✅ Converted columns to snake_case');
      
    } else if (!hasSnakeCase && !hasCamelCase) {
      console.log('➕ Adding missing reset token columns...');
      
      // Add new columns
      await sequelize.query(`
        ALTER TABLE admins 
        ADD COLUMN reset_token VARCHAR(255),
        ADD COLUMN reset_token_expiry TIMESTAMP WITH TIME ZONE
      `);
      console.log('✅ Added reset token columns');
      
    } else if (hasSnakeCase) {
      console.log('✅ Reset token columns already exist in correct format');
    }
    
    // Verify final structure
    const [finalColumns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'admins' 
      AND table_schema = 'public'
      AND column_name IN ('reset_token', 'reset_token_expiry')
      ORDER BY column_name
    `);
    
    console.log('📋 Final reset token columns:');
    finalColumns.forEach(col => {
      console.log(`  ✅ ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    if (finalColumns.length === 2) {
      console.log('🎉 Password reset migration completed successfully!');
      console.log('🔐 Your application now supports secure password reset with email verification');
    } else {
      console.log('❌ Migration incomplete - missing columns');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run if called directly
if (require.main === module) {
  migrateResetTokens()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { migrateResetTokens };