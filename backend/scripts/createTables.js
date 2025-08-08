require("dotenv").config();
const { sequelize } = require("../config/database");
const fs = require("fs");
const path = require("path");

const createTables = async () => {
  try {
    console.log("🏗️  Creating database tables...");

    // Connect to database
    await sequelize.authenticate();
    console.log("📡 Database connected successfully");

    // Create migrations table if it doesn't exist
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
        "name" VARCHAR(255) NOT NULL PRIMARY KEY
      );
    `);

    // Get list of migration files
    const migrationsDir = path.join(__dirname, "../migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".js"))
      .sort();

    console.log(`📁 Found ${migrationFiles.length} migration files`);

    // Get already executed migrations
    const [executedMigrations] = await sequelize.query(
      'SELECT name FROM "SequelizeMeta" ORDER BY name'
    );
    const executedNames = executedMigrations.map((row) => row.name);

    console.log(`✅ Already executed: ${executedNames.length} migrations`);

    // Run pending migrations
    let executedCount = 0;
    for (const file of migrationFiles) {
      if (!executedNames.includes(file)) {
        console.log(`🔄 Running migration: ${file}`);

        const migration = require(path.join(migrationsDir, file));
        await migration.up(
          sequelize.getQueryInterface(),
          sequelize.constructor
        );

        // Record migration as executed
        await sequelize.query('INSERT INTO "SequelizeMeta" (name) VALUES (?)', {
          replacements: [file],
        });

        console.log(`✅ Completed migration: ${file}`);
        executedCount++;
      }
    }

    if (executedCount === 0) {
      console.log("✨ All tables are already created!");
    } else {
      console.log(`🎉 Successfully created ${executedCount} new tables`);
    }
  } catch (error) {
    console.error("❌ Table creation failed:", error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run if called directly
if (require.main === module) {
  createTables()
    .then(() => {
      console.log("🎉 Table creation completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Table creation failed:", error);
      process.exit(1);
    });
}

module.exports = createTables;
