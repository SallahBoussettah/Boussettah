require("dotenv").config();
const { sequelize } = require("../config/database");
const { Education, Experience, TechStack } = require("../models");

const seedAboutData = async () => {
  try {
    console.log("🌱 Starting About page data seeding...");
    console.log(
      "⚠️  This will replace existing experience, education, and tech stack data!\n"
    );

    // Connect to database
    await sequelize.authenticate();
    console.log("📡 Database connected successfully\n");

    // 1. Seed Experience
    console.log("1/3 Seeding Experience...");
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
          "Maintained and updated existing web applications",
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
          "Worked with enterprise-level Java technologies",
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
          "Published multiple open-source projects",
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
          "Maintained consistent art quality and style over 5 years",
        ],
        order: 4,
        isActive: true,
        isCurrent: true,
      },
    ];
    await Experience.destroy({ where: {} });
    await Experience.bulkCreate(experienceData);
    console.log(`✅ Added ${experienceData.length} experience entries`);

    // 2. Seed Education
    console.log("\n2/3 Seeding Education...");
    const educationData = [
      {
        degree: "Diploma in Computer Science",
        school: "Technical Institute",
        year: "2023 - 2025",
        description:
          "Comprehensive 2-year program in computer science covering software development, programming languages, database management, and web technologies. Focused on practical application of modern development frameworks and tools.",
        icon: "GraduationCap",
        order: 1,
        isActive: true,
      },
      {
        degree: "SVI (Biology) Studies",
        school: "FSSM - University Semlalia, Marrakech",
        year: "2021 - 2023",
        description:
          "2-year study program in Biology (Sciences de la Vie - SVI) at Faculty of Sciences Semlalia, University Cadi Ayyad in Marrakech. Gained foundational knowledge in biological sciences and scientific methodology.",
        icon: "Book",
        order: 2,
        isActive: true,
      },
      {
        degree: "Baccalauréat in Physics and Chemistry",
        school: "High School",
        year: "2021",
        description:
          "High school diploma specializing in Physics and Chemistry. Strong foundation in scientific principles, mathematics, and analytical thinking that later supported transition to computer science.",
        icon: "Award",
        order: 3,
        isActive: true,
      },
    ];
    await Education.destroy({ where: {} });
    await Education.bulkCreate(educationData);
    console.log(`✅ Added ${educationData.length} education entries`);

    // 3. Seed Tech Stack
    console.log("\n3/3 Seeding Tech Stack...");
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
      {
        name: "React Hook Form",
        category: "Frontend",
        order: 11,
        isActive: true,
      },
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
      {
        name: "Android Development",
        category: "Mobile",
        order: 5,
        isActive: true,
      },
      { name: "iOS Development", category: "Mobile", order: 6, isActive: true },

      // Game Dev
      { name: "Godot Engine", category: "Game Dev", order: 1, isActive: true },
      { name: "GDScript", category: "Game Dev", order: 2, isActive: true },
      { name: "Unity", category: "Game Dev", order: 3, isActive: true },
      { name: "C#", category: "Game Dev", order: 4, isActive: true },
      { name: "JavaFX", category: "Game Dev", order: 5, isActive: true },
      { name: "Game Physics", category: "Game Dev", order: 6, isActive: true },
      {
        name: "2D Game Development",
        category: "Game Dev",
        order: 7,
        isActive: true,
      },
      { name: "Game Design", category: "Game Dev", order: 8, isActive: true },

      // Design
      { name: "Digital Art", category: "Design", order: 1, isActive: true },
      {
        name: "Character Design",
        category: "Design",
        order: 2,
        isActive: true,
      },
      { name: "Illustration", category: "Design", order: 3, isActive: true },
      { name: "Concept Art", category: "Design", order: 4, isActive: true },
      { name: "Aseprite", category: "Design", order: 5, isActive: true },
      {
        name: "Adobe Creative Suite",
        category: "Design",
        order: 6,
        isActive: true,
      },
      { name: "Figma", category: "Design", order: 7, isActive: true },
      { name: "UI/UX Design", category: "Design", order: 8, isActive: true },
      {
        name: "Responsive Design",
        category: "Design",
        order: 9,
        isActive: true,
      },
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
    await TechStack.destroy({ where: {} });
    await TechStack.bulkCreate(techStackData);
    console.log(`✅ Added ${techStackData.length} tech stack entries`);

    console.log("\n✅ About page data seeding completed successfully!");
    console.log("🎉 Your about page is now populated with:");
    console.log("   • 4 Experience entries (including current positions)");
    console.log(
      "   • 3 Education records (from baccalauréat to current diploma)"
    );
    console.log("   • 59 Tech stack items across 6 categories");
    console.log(
      "\n📊 Data reflects your actual educational and professional journey:"
    );
    console.log("   • Art journey started in 2020 (personal passion)");
    console.log(
      "   • Educational path: Physics/Chemistry → Biology → Computer Science"
    );
    console.log(
      "   • Professional experience: SNIM internship → Eureka Digital"
    );
  } catch (error) {
    console.error("❌ About data seeding failed:", error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run if called directly
if (require.main === module) {
  seedAboutData()
    .then(() => {
      console.log("\n🎉 About data seeding process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 About data seeding process failed:", error);
      process.exit(1);
    });
}

module.exports = seedAboutData;
