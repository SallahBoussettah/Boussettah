require('dotenv').config();
require('dotenv').config();
const { Education } = require('../models');

const seedEducation = async () => {
  try {
    console.log('🌱 Seeding education data...');

    const educationData = [
      {
        degree: "Diploma in Computer Science",
        school: "Technical Institute",
        year: "2023 - 2025",
        description: "Comprehensive 2-year program in computer science covering software development, programming languages, database management, and web technologies. Focused on practical application of modern development frameworks and tools.",
        icon: "GraduationCap",
        order: 1,
        isActive: true
      },
      {
        degree: "SVI (Biology) Studies",
        school: "FSSM - University Semlalia, Marrakech",
        year: "2021 - 2023",
        description: "2-year study program in Biology (Sciences de la Vie - SVI) at Faculty of Sciences Semlalia, University Cadi Ayyad in Marrakech. Gained foundational knowledge in biological sciences and scientific methodology.",
        icon: "Book",
        order: 2,
        isActive: true
      },
      {
        degree: "Baccalauréat in Physics and Chemistry",
        school: "High School",
        year: "2021",
        description: "High school diploma specializing in Physics and Chemistry. Strong foundation in scientific principles, mathematics, and analytical thinking that later supported transition to computer science.",
        icon: "Award",
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