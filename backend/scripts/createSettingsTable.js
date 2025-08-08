require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

const createSettingsTable = async () => {
  try {
    console.log('🔄 Creating settings table...');
    
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
    
    console.log('🎉 Settings table created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating settings table:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

createSettingsTable()
  .then(() => {
    console.log('🎉 Settings table creation completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Settings table creation failed:', error);
    process.exit(1);
  });