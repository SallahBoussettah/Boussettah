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
      { name: "TypeScript", category: "Frontend", order: 3, isActive: true },
      { name: "JavaScript", category: "Frontend", order: 4, isActive: true },
      { name: "HTML5", category: "Frontend", order: 5, isActive: true },
      { name: "CSS3", category: "Frontend", order: 6, isActive: true },
      { name: "Tailwind CSS", category: "Frontend", order: 7, isActive: true },
      { name: "Framer Motion", category: "Frontend", order: 8, isActive: true },
      { name: "Redux Toolkit", category: "Frontend", order: 9, isActive: true },
      { name: "React Router", category: "Frontend", order: 10, isActive: true },
      { name: "React Hook Form", category: "Frontend", order: 11, isActive: true },
      { name: "React Query", category: "Frontend", order: 12, isActive: true },
      { name: "GSAP", category: "Frontend", order: 13, isActive: true },

      // Backend
      { name: "Node.js", category: "Backend", order: 1, isActive: true },
      { name: "Express.js", category: "Backend", order: 2, isActive: true },
      { name: "Laravel", category: "Backend", order: 3, isActive: true },
      { name: "PHP", category: "Backend", order: 4, isActive: true },
      { name: "Java", category: "Backend", order: 5, isActive: true },
      { name: "PostgreSQL", category: "Backend", order: 6, isActive: true },
      { name: "MySQL", category: "Backend", order: 7, isActive: true },
      { name: "Sequelize", category: "Backend", order: 8, isActive: true },
      { name: "JWT", category: "Backend", order: 9, isActive: true },
      { name: "RESTful APIs", category: "Backend", order: 10, isActive: true },
      { name: "Bcrypt", category: "Backend", order: 11, isActive: true },

      // Mobile
      { name: "React Native", category: "Mobile", order: 1, isActive: true },
      { name: "Flutter", category: "Mobile", order: 2, isActive: true },
      { name: "Expo", category: "Mobile", order: 3, isActive: true },
      { name: "Firebase", category: "Mobile", order: 4, isActive: true },
      { name: "Android Development", category: "Mobile", order: 5, isActive: true },
      { name: "iOS Development", category: "Mobile", order: 6, isActive: true },

      // Game Dev
      { name: "Godot Engine", category: "Game Dev", order: 1, isActive: true },
      { name: "GDScript", category: "Game Dev", order: 2, isActive: true },
      { name: "Unity", category: "Game Dev", order: 3, isActive: true },
      { name: "C#", category: "Game Dev", order: 4, isActive: true },
      { name: "JavaFX", category: "Game Dev", order: 5, isActive: true },
      { name: "Game Physics", category: "Game Dev", order: 6, isActive: true },
      { name: "2D Game Development", category: "Game Dev", order: 7, isActive: true },
      { name: "Game Design", category: "Game Dev", order: 8, isActive: true },

      // Design
      { name: "Digital Art", category: "Design", order: 1, isActive: true },
      { name: "Character Design", category: "Design", order: 2, isActive: true },
      { name: "Illustration", category: "Design", order: 3, isActive: true },
      { name: "Concept Art", category: "Design", order: 4, isActive: true },
      { name: "Aseprite", category: "Design", order: 5, isActive: true },
      { name: "Adobe Creative Suite", category: "Design", order: 6, isActive: true },
      { name: "Figma", category: "Design", order: 7, isActive: true },
      { name: "UI/UX Design", category: "Design", order: 8, isActive: true },
      { name: "Responsive Design", category: "Design", order: 9, isActive: true },
      { name: "Animation", category: "Design", order: 10, isActive: true },

      // Tools
      { name: "Git", category: "Tools", order: 1, isActive: true },
      { name: "GitHub", category: "Tools", order: 2, isActive: true },
      { name: "VS Code", category: "Tools", order: 3, isActive: true },
      { name: "Maven", category: "Tools", order: 4, isActive: true },
      { name: "JPackage", category: "Tools", order: 5, isActive: true },
      { name: "Netlify", category: "Tools", order: 6, isActive: true },
      { name: "Vercel", category: "Tools", order: 7, isActive: true },
      { name: "NPM", category: "Tools", order: 8, isActive: true },
      { name: "Webpack", category: "Tools", order: 9, isActive: true },
      { name: "ESLint", category: "Tools", order: 10, isActive: true },
      { name: "Prettier", category: "Tools", order: 11, isActive: true },
      { name: "Linux", category: "Tools", order: 12, isActive: true },
      { name: "Windows", category: "Tools", order: 13, isActive: true },
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