require('dotenv').config();
const { Experience } = require("../models");

const seedExperience = async () => {
  try {
    console.log("🌱 Seeding experience data...");

    const experienceData = [
      {
        title: "Senior Full Stack Developer",
        company: "TechCorp Solutions",
        period: "2022 - Present",
        location: "Remote",
        description:
          "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and architecting system solutions.",
        achievements: [
          "Increased application performance by 40%",
          "Led a team of 5 developers",
          "Implemented CI/CD pipelines",
        ],
        order: 1,
        isActive: true,
        isCurrent: true,
      },
      {
        title: "Game Developer",
        company: "Indie Game Studio",
        period: "2021 - 2022",
        location: "Morocco",
        description:
          "Developed mobile and PC games using Unity and C#. Collaborated with artists and designers to create engaging gaming experiences.",
        achievements: [
          "Published 3 successful mobile games",
          "Achieved 100K+ downloads",
          "Implemented multiplayer functionality",
        ],
        order: 2,
        isActive: true,
        isCurrent: false,
      },
      {
        title: "Frontend Developer",
        company: "Digital Agency",
        period: "2020 - 2021",
        location: "Casablanca, Morocco",
        description:
          "Created responsive web applications and interactive user interfaces. Worked closely with design teams to implement pixel-perfect designs.",
        achievements: [
          "Delivered 15+ client projects",
          "Improved website loading speed by 60%",
          "Implemented modern design systems",
        ],
        order: 3,
        isActive: true,
        isCurrent: false,
      },
      {
        title: "Digital Artist (Freelance)",
        company: "Various Clients",
        period: "2019 - Present",
        location: "Remote",
        description:
          "Creating digital illustrations, concept art, and visual designs for games, websites, and marketing materials.",
        achievements: [
          "Completed 50+ art commissions",
          "Worked with international clients",
          "Developed unique art style",
        ],
        order: 4,
        isActive: true,
        isCurrent: true,
      },
    ];

    // Clear existing experience data
    await Experience.destroy({ where: {} });

    // Insert new experience data
    await Experience.bulkCreate(experienceData);

    console.log("✅ Experience data seeded successfully!");
    console.log(`💼 Added ${experienceData.length} experience entries`);
  } catch (error) {
    console.error("❌ Error seeding experience data:", error);
  }
};

// Run if called directly
if (require.main === module) {
  const { sequelize } = require("../config/database");

  sequelize
    .authenticate()
    .then(() => {
      console.log("📡 Database connected successfully");
      return seedExperience();
    })
    .then(() => {
      console.log("🎉 Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}

module.exports = seedExperience;
