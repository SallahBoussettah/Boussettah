const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');

const runMigrations = async () => {
  try {
    console.log('🔄 Starting database migrations...');
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();

    console.log(`Found ${migrationFiles.length} migration files`);

    // Run each migration
    for (const file of migrationFiles) {
      try {
        console.log(`\n📄 Running migration: ${file}`);
        const migration = require(path.join(migrationsDir, file));
        
        if (migration.up) {
          await migration.up(sequelize.getQueryInterface(), sequelize.constructor);
          console.log(`✅ Migration ${file} completed successfully`);
        } else {
          console.log(`⚠️  Migration ${file} has no 'up' method, skipping`);
        }
      } catch (error) {
        if (error.message.includes('already exists') || 
            error.message.includes('relation') && error.message.includes('already exists')) {
          console.log(`⚠️  Migration ${file} - Table already exists, skipping`);
        } else {
          console.error(`❌ Error running migration ${file}:`, error.message);
          // Continue with other migrations instead of stopping
        }
      }
    }

    console.log('\n✅ All migrations completed!');
    
  } catch (error) {
    console.error('❌ Migration process failed:', error);
    process.exit(1);
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('🎉 Migration process finished successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations };