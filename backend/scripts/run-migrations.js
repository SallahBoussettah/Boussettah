require('dotenv').config();
const { sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Create migrations table if it doesn't exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "migrations" (
        "name" VARCHAR(255) NOT NULL PRIMARY KEY,
        "executed_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Get executed migrations
    const [executedMigrations] = await sequelize.query(
      'SELECT name FROM migrations ORDER BY executed_at'
    );
    const executedNames = executedMigrations.map(m => m.name);

    // Get migration files
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.js'))
      .sort();

    console.log(`📁 Found ${migrationFiles.length} migration files`);
    console.log(`✅ Already executed: ${executedNames.length} migrations`);

    // Run pending migrations
    for (const file of migrationFiles) {
      if (!executedNames.includes(file)) {
        console.log(`🔄 Running migration: ${file}`);
        
        const migration = require(path.join(migrationsDir, file));
        await migration.up(sequelize.getQueryInterface(), sequelize);
        
        // Record migration as executed
        await sequelize.query(
          'INSERT INTO migrations (name) VALUES (?)',
          { replacements: [file] }
        );
        
        console.log(`✅ Completed migration: ${file}`);
      } else {
        console.log(`⏭️  Skipping already executed migration: ${file}`);
      }
    }

    console.log('🎉 All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();