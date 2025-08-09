require('dotenv').config();
const { Experience } = require("../models");

const seedExperience = async () => {
  try {
    console.log("🌱 Seeding experience data...");

    const experienceData = [
      {
        title: "Full-Stack Laravel Developer",
        company: "Eureka Digital",
        period: "2025 - Present",
        location: "Morocco",
        description:
          "Working at Eureka Digital company as a full stack Laravel developer, creating appealing and dynamic websites. Developing modern web applications with focus on user experience and performance optimization.",
        achievements: [
          "Developed multiple client websites using Laravel framework",
          "Implemented responsive designs with modern CSS frameworks",
          "Optimized database queries for improved performance",
          "Collaborated with design teams to deliver pixel-perfect implementations",
          "Maintained and updated existing web applications"
        ],
        order: 1,
        isActive: true,
        isCurrent: true,
      },
      {
        title: "Java Developer Intern",
        company: "SNIM",
        period: "2025 (FINISHED)",
        location: "Mauritania",
        description:
          "Java Developer Intern at SNIM (Africa's second-largest iron ore producer). Designed and built a full-stack website to manage employee/visitor badges, including printing, subscription handling, and access level controls.",
        achievements: [
          "Developed a comprehensive badge management system",
          "Implemented employee and visitor access control features",
          "Created printing and subscription handling functionality",
          "Built user-friendly admin interface for badge management",
          "Integrated security features for access level controls",
          "Worked with enterprise-level Java technologies"
        ],
        order: 2,
        isActive: true,
        isCurrent: false,
      },
      {
        title: "Full-Stack Developer (Personal Projects)",
        company: "Personal Projects",
        period: "2024 - Present",
        location: "Remote",
        description:
          "Developing various personal projects including interactive web applications, games, and e-commerce platforms. Specializing in modern web technologies and creative digital solutions.",
        achievements: [
          "Built interactive terminal website with games and themes",
          "Developed 2D platformer game using Godot Engine",
          "Created modern e-commerce templates with React and TypeScript",
          "Designed agency portfolio templates with advanced animations",
          "Implemented JavaFX desktop applications",
          "Published multiple open-source projects"
        ],
        order: 3,
        isActive: true,
        isCurrent: true,
      },
      {
        title: "Digital Artist & Illustrator",
        company: "Personal Art",
        period: "2020 - Present",
        location: "Remote",
        description:
          "Creating digital illustrations and anime character art as a personal passion. Specializing in character portraits, digital painting, and illustration work for personal enjoyment and skill development.",
        achievements: [
          "Created 18+ professional digital art pieces",
          "Specialized in anime and character illustration",
          "Developed unique artistic style and techniques",
          "Built comprehensive art portfolio website",
          "Mastered digital art tools and software",
          "Maintained consistent art quality and style over 5 years"
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
