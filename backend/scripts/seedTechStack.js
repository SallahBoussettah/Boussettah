require('dotenv').config();
const { TechStack } = require('../models');

const seedTechStack = async () => {
  try {
    console.log('⚙️  Seeding tech stack data...');

    // Connect to database
    const { sequelize } = require('../config/database');
    await sequelize.authenticate();
    console.log('📡 Database connected successfully');

    const techStackData = [
      // Frontend
      { name: "React", category: "Frontend", order: 1, isActive: true },
      { name: "Next.js", category: "Frontend", order: 2, isActive: true },
      { name: "Vue.js", category: "Frontend", order: 3, isActive: true },
      { name: "TypeScript", category: "Frontend", order: 4, isActive: true },
      { name: "Tailwind CSS", category: "Frontend", order: 5, isActive: true },
      { name: "Framer Motion", category: "Frontend", order: 6, isActive: true },

      // Backend
      { name: "Node.js", category: "Backend", order: 1, isActive: true },
      { name: "Python", category: "Backend", order: 2, isActive: true },
      { name: "Express", category: "Backend", order: 3, isActive: true },
      { name: "FastAPI", category: "Backend", order: 4, isActive: true },
      { name: "PostgreSQL", category: "Backend", order: 5, isActive: true },
      { name: "MongoDB", category: "Backend", order: 6, isActive: true },

      // Mobile
      { name: "React Native", category: "Mobile", order: 1, isActive: true },
      { name: "Flutter", category: "Mobile", order: 2, isActive: true },
      { name: "Swift", category: "Mobile", order: 3, isActive: true },
      { name: "Kotlin", category: "Mobile", order: 4, isActive: true },
      { name: "Expo", category: "Mobile", order: 5, isActive: true },
      { name: "Firebase", category: "Mobile", order: 6, isActive: true },

      // Game Dev
      { name: "Unity", category: "Game Dev", order: 1, isActive: true },
      { name: "Unreal Engine", category: "Game Dev", order: 2, isActive: true },
      { name: "Godot", category: "Game Dev", order: 3, isActive: true },
      { name: "C#", category: "Game Dev", order: 4, isActive: true },
      { name: "C++", category: "Game Dev", order: 5, isActive: true },
      { name: "Blender", category: "Game Dev", order: 6, isActive: true },

      // Design
      { name: "Figma", category: "Design", order: 1, isActive: true },
      { name: "Adobe Creative Suite", category: "Design", order: 2, isActive: true },
      { name: "Sketch", category: "Design", order: 3, isActive: true },
      { name: "Procreate", category: "Design", order: 4, isActive: true },
      { name: "Cinema 4D", category: "Design", order: 5, isActive: true },
      { name: "After Effects", category: "Design", order: 6, isActive: true },

      // Tools
      { name: "Git", category: "Tools", order: 1, isActive: true },
      { name: "Docker", category: "Tools", order: 2, isActive: true },
      { name: "AWS", category: "Tools", order: 3, isActive: true },
      { name: "Vercel", category: "Tools", order: 4, isActive: true },
      { name: "Linux", category: "Tools", order: 5, isActive: true },
      { name: "VS Code", category: "Tools", order: 6, isActive: true },
    ];

    // Clear existing tech stack data
    await TechStack.destroy({ where: {} });

    // Insert new tech stack data
    await TechStack.bulkCreate(techStackData);

    console.log('✅ Tech stack data seeded successfully!');
    console.log(`⚙️  Added ${techStackData.length} tech stack entries`);

  } catch (error) {
    console.error('❌ Error seeding tech stack data:', error);
    throw error;
  } finally {
    const { sequelize } = require('../config/database');
    await sequelize.close();
  }
};

// Run if called directly
if (require.main === module) {
  seedTechStack()
    .then(() => {
      console.log('🎉 Tech stack seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Tech stack seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedTechStack;