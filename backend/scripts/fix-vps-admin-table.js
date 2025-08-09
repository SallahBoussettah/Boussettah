const { sequelize } = require('../config/database');

async function fixVPSAdminTable() {
  try {
    console.log('🔄 Fixing VPS admin table structure...');
    
    // Check current table structure
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'admins' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    const existingColumns = results.map(row => row.column_name);
    console.log('📋 Current columns:', existingColumns);
    
    // Check if we have camelCase columns but need snake_case
    const hasCamelCase = existingColumns.includes('resetToken') && existingColumns.includes('resetTokenExpiry');
    const hasSnakeCase = existingColumns.includes('reset_token') && existingColumns.includes('reset_token_expiry');
    
    if (hasCamelCase && !hasSnakeCase) {
      console.log('🔄 Converting camelCase columns to snake_case...');
      
      // Rename resetToken to reset_token
      await sequelize.query('ALTER TABLE admins RENAME COLUMN "resetToken" TO reset_token');
      console.log('✅ Renamed resetToken to reset_token');
      
      // Rename resetTokenExpiry to reset_token_expiry
      await sequelize.query('ALTER TABLE admins RENAME COLUMN "resetTokenExpiry" TO reset_token_expiry');
      console.log('✅ Renamed resetTokenExpiry to reset_token_expiry');
      
    } else if (!hasCamelCase && !hasSnakeCase) {
      console.log('➕ Adding missing reset token columns...');
      
      // Add reset_token column
      await sequelize.query(`
        ALTER TABLE admins 
        ADD COLUMN reset_token VARCHAR(255)
      `);
      console.log('✅ Added reset_token column');
      
      // Add reset_token_expiry column
      await sequelize.query(`
        ALTER TABLE admins 
        ADD COLUMN reset_token_expiry TIMESTAMP WITH TIME ZONE
      `);
      console.log('✅ Added reset_token_expiry column');
      
    } else if (hasSnakeCase) {
      console.log('✅ Snake_case columns already exist - no changes needed');
    }
    
    // Verify final structure
    const [finalResults] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'admins' 
      AND table_schema = 'public'
      AND column_name IN ('reset_token', 'reset_token_expiry')
      ORDER BY column_name
    `);
    
    console.log('📋 Final reset token columns:');
    finalResults.forEach(row => {
      console.log(`  ✅ ${row.column_name}`);
    });
    
    if (finalResults.length === 2) {
      console.log('🎉 VPS admin table is now correctly configured!');
      console.log('🔐 Password reset with email verification is ready to use');
    } else {
      console.log('❌ Something went wrong - missing columns');
    }
    
  } catch (error) {
    console.error('❌ Error fixing VPS admin table:', error.message);
    console.error('Full error:', error);
  } finally {
    await sequelize.close();
  }
}

fixVPSAdminTable();