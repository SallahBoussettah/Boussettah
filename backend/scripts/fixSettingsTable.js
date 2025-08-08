const { sequelize } = require('../config/database');

const fixSettingsTable = async () => {
  try {
    console.log('🔄 Fixing settings table...');
    
    // Drop the existing settings table if it exists
    await sequelize.query('DROP TABLE IF EXISTS settings CASCADE;');
    console.log('✅ Dropped existing settings table');
    
    // Drop the enum type if it exists
    await sequelize.query('DROP TYPE IF EXISTS "enum_settings_type" CASCADE;');
    console.log('✅ Dropped existing enum type');
    
    // Create the enum type
    await sequelize.query(`
      CREATE TYPE "enum_settings_type" AS ENUM ('string', 'number', 'boolean', 'json', 'array');
    `);
    console.log('✅ Created enum type');
    
    // Create the settings table with correct structure
    await sequelize.query(`
      CREATE TABLE "settings" (
        "id" SERIAL PRIMARY KEY,
        "key" VARCHAR(100) NOT NULL UNIQUE,
        "value" TEXT,
        "type" "enum_settings_type" NOT NULL DEFAULT 'string',
        "category" VARCHAR(50) NOT NULL DEFAULT 'general',
        "description" TEXT,
        "isPublic" BOOLEAN NOT NULL DEFAULT true,
        "isEditable" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created settings table');
    
    // Create indexes
    await sequelize.query('CREATE UNIQUE INDEX "settings_key_unique" ON "settings" ("key");');
    await sequelize.query('CREATE INDEX "settings_category_index" ON "settings" ("category");');
    await sequelize.query('CREATE INDEX "settings_is_public_index" ON "settings" ("isPublic");');
    console.log('✅ Created indexes');
    
    console.log('🎉 Settings table fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing settings table:', error);
    throw error;
  }
};

// Run if this file is executed directly
if (require.main === module) {
  sequelize.authenticate()
    .then(() => {
      console.log('✅ Database connection established');
      return fixSettingsTable();
    })
    .then(() => {
      console.log('🎉 Settings table fix completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Settings table fix failed:', error);
      process.exit(1);
    });
}

module.exports = { fixSettingsTable };