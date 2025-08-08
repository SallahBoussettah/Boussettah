require('dotenv').config();
require('dotenv').config();
const { Education } = require('../models');

const seedEducation = async () => {
  try {
    console.log('🌱 Seeding education data...');

    const educationData = [
      {
        degree: "Master's in Computer Science",
        school: "University of Technology",
        year: "2020 - 2022",
        description: "Specialized in Software Engineering and Artificial Intelligence. Graduated with honors.",
        icon: "Award",
        order: 1,
        isActive: true
      },
      {
        degree: "Bachelor's in Information Technology",
        school: "Institute of Technology",
        year: "2017 - 2020",
        description: "Foundation in programming, databases, and system design. Active in coding competitions.",
        icon: "Code",
        order: 2,
        isActive: true
      },
      {
        degree: "Digital Art Certification",
        school: "Creative Arts Academy",
        year: "2019",
        description: "Comprehensive training in digital illustration, 3D modeling, and visual design principles.",
        icon: "Palette",
        order: 3,
        isActive: true
      }
    ];

    // Clear existing education data
    await Education.destroy({ where: {} });

    // Insert new education data
    await Education.bulkCreate(educationData);

    console.log('✅ Education data seeded successfully!');
    console.log(`📚 Added ${educationData.length} education entries`);

  } catch (error) {
    console.error('❌ Error seeding education data:', error);
  }
};

// Run if called directly
if (require.main === module) {
  const { sequelize } = require('../config/database');
  
  sequelize.authenticate()
    .then(() => {
      console.log('📡 Database connected successfully');
      return seedEducation();
    })
    .then(() => {
      console.log('🎉 Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedEducation;