require('dotenv').config();
const { sequelize } = require('../config/database');

const resetDatabase = async () => {
  try {
    console.log('🗑️  RESETTING ENTIRE DATABASE...');
    console.log('⚠️  WARNING: This will delete ALL data!');

    // Connect to database
    await sequelize.authenticate();
    console.log('📡 Database connected successfully');

    // Get all tables to drop
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log(`\n🔍 Found ${tables.length} tables to drop:`);
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name}`);
    });

    // Drop all tables
    console.log('\n💥 Dropping all tables...');
    for (const table of tables) {
      try {
        await sequelize.query(`DROP TABLE IF EXISTS "${table.table_name}" CASCADE;`);
        console.log(`   ✓ Dropped table: ${table.table_name}`);
      } catch (error) {
        console.log(`   ❌ Failed to drop table: ${table.table_name} - ${error.message}`);
      }
    }

    // Drop all ENUM types
    console.log('\n🔧 Cleaning up ENUM types...');
    const [enums] = await sequelize.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typtype = 'e' 
      AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    `);

    for (const enumType of enums) {
      try {
        await sequelize.query(`DROP TYPE IF EXISTS "${enumType.typname}" CASCADE;`);
        console.log(`   ✓ Dropped ENUM type: ${enumType.typname}`);
      } catch (error) {
        console.log(`   ❌ Failed to drop ENUM type: ${enumType.typname} - ${error.message}`);
      }
    }

    // Drop all sequences
    console.log('\n🔢 Cleaning up sequences...');
    const [sequences] = await sequelize.query(`
      SELECT sequencename 
      FROM pg_sequences 
      WHERE schemaname = 'public';
    `);

    for (const sequence of sequences) {
      try {
        await sequelize.query(`DROP SEQUENCE IF EXISTS "${sequence.sequencename}" CASCADE;`);
        console.log(`   ✓ Dropped sequence: ${sequence.sequencename}`);
      } catch (error) {
        console.log(`   ❌ Failed to drop sequence: ${sequence.sequencename} - ${error.message}`);
      }
    }

    console.log('\n✅ Database reset completed successfully!');
    console.log('💡 Run "node scripts/createTables.js" to recreate all tables');

  } catch (error) {
    console.error('❌ Database reset failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run if called directly
if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('\n🎉 Database reset process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database reset process failed:', error);
      process.exit(1);
    });
}

module.exports = resetDatabase;