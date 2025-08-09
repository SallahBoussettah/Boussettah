const { sequelize } = require('../config/database');

async function fixContactsTable() {
  try {
    console.log('🔧 Fixing contacts table schema...');
    
    // Check if contacts table exists
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'contacts'
    `);
    
    if (tables.length === 0) {
      console.log('📋 Creating contacts table...');
      
      // Create contacts table with correct schema
      await sequelize.query(`
        CREATE TABLE contacts (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'new',
          ip_address VARCHAR(45),
          user_agent TEXT,
          "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        )
      `);
      
      console.log('✅ Contacts table created successfully');
    } else {
      console.log('📋 Contacts table exists, checking schema...');
      
      // Get current columns
      const [columns] = await sequelize.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'contacts' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `);
      
      const columnNames = columns.map(col => col.column_name);
      console.log('Current columns:', columnNames);
      
      // Fix column names if needed
      if (columnNames.includes('created_at') && !columnNames.includes('createdAt')) {
        console.log('🔄 Renaming created_at to createdAt...');
        await sequelize.query('ALTER TABLE contacts RENAME COLUMN created_at TO "createdAt"');
      }
      
      if (columnNames.includes('updated_at') && !columnNames.includes('updatedAt')) {
        console.log('🔄 Renaming updated_at to updatedAt...');
        await sequelize.query('ALTER TABLE contacts RENAME COLUMN updated_at TO "updatedAt"');
      }
      
      // Add missing columns if needed
      const requiredColumns = ['name', 'email', 'subject', 'message', 'status', 'ip_address', 'user_agent'];
      
      for (const column of requiredColumns) {
        if (!columnNames.includes(column)) {
          console.log(`➕ Adding missing column: ${column}`);
          
          let columnDef;
          switch (column) {
            case 'name':
            case 'email':
            case 'subject':
              columnDef = 'VARCHAR(255) NOT NULL';
              break;
            case 'message':
            case 'user_agent':
              columnDef = 'TEXT';
              break;
            case 'status':
              columnDef = "VARCHAR(50) DEFAULT 'new'";
              break;
            case 'ip_address':
              columnDef = 'VARCHAR(45)';
              break;
          }
          
          await sequelize.query(`ALTER TABLE contacts ADD COLUMN ${column} ${columnDef}`);
        }
      }
      
      console.log('✅ Contacts table schema fixed');
    }
    
    // Test the table
    console.log('\n🧪 Testing contacts table...');
    const [testResult] = await sequelize.query('SELECT COUNT(*) as count FROM contacts');
    console.log(`📊 Current contacts count: ${testResult[0].count}`);
    
    console.log('\n🎉 Contacts table is ready!');
    
  } catch (error) {
    console.error('❌ Error fixing contacts table:', error.message);
  } finally {
    await sequelize.close();
  }
}

fixContactsTable();