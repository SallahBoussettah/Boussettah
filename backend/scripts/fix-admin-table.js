const { sequelize } = require('../config/database');

async function fixAdminTable() {
  try {
    console.log('🔄 Checking and fixing admin table structure...');
    
    // Get current table structure
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'admins' 
      AND table_schema = 'public'
    `);
    
    const existingColumns = results.map(row => row.column_name);
    console.log('📋 Existing columns:', existingColumns);
    
    // Check if reset_token column exists
    if (!existingColumns.includes('reset_token')) {
      console.log('➕ Adding reset_token column...');
      await sequelize.query(`
        ALTER TABLE admins 
        ADD COLUMN reset_token VARCHAR(255)
      `);
      console.log('✅ reset_token column added');
    } else {
      console.log('✅ reset_token column already exists');
    }
    
    // Check if reset_token_expiry column exists
    if (!existingColumns.includes('reset_token_expiry')) {
      console.log('➕ Adding reset_token_expiry column...');
      await sequelize.query(`
        ALTER TABLE admins 
        ADD COLUMN reset_token_expiry TIMESTAMP WITH TIME ZONE
      `);
      console.log('✅ reset_token_expiry column added');
    } else {
      console.log('✅ reset_token_expiry column already exists');
    }
    
    console.log('🎉 Admin table structure is now correct!');
    
  } catch (error) {
    console.error('❌ Error fixing admin table:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixAdminTable();