require('dotenv').config();
const { sequelize } = require('../config/database');
const { Admin, Project, Art, Education, Experience, TechStack } = require('../models');

const seedAll = async () => {
  try {
    console.log('🌱 Starting complete database seeding...');
    console.log('⚠️  This will replace all existing data!\n');

    // Connect to database once
    await sequelize.authenticate();
    console.log('📡 Database connected successfully\n');

    // 1. Seed Admin
    console.log('1/5 Seeding Admin...');
    await Admin.createDefaultAdmin();
    console.log('✅ Admin seeding completed!');
    
    // 2. Seed Projects
    console.log('\n2/5 Seeding Projects...');
    const sampleProjects = [
      {
        title: "E-Commerce Platform",
        subtitle: "Full-Stack Shopping Solution",
        slug: "ecommerce-platform",
        description: "A comprehensive e-commerce platform with advanced features including user authentication, payment processing, inventory management, and admin dashboard.",
        longDescription: "This e-commerce platform represents a complete solution for online retail businesses. Built with React and Node.js, it features a microservices architecture that ensures scalability and maintainability.",
        shortDescription: "Full-stack e-commerce solution with React, Node.js, and advanced features for online retail businesses.",
        category: "web",
        status: "completed",
        technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe", "JWT", "Socket.io"],
        features: ["User Authentication", "Payment Processing", "Inventory Management", "Order Tracking", "Admin Dashboard", "Real-time Notifications"],
        challenges: ["Payment Integration", "Real-time Updates", "Scalable Architecture", "Security Implementation"],
        learnings: ["Microservices Architecture", "Payment Gateway Integration", "Real-time Communication", "Database Optimization"],
        githubUrl: "https://github.com/username/ecommerce-platform",
        liveUrl: "https://ecommerce-demo.com",
        demoUrl: "https://youtube.com/watch?v=demo",
        featured: true,
        priority: 1,
        year: "2024",
        startDate: "2024-01-01",
        endDate: "2024-06-30",
        views: 250,
        likes: 45,
        stars: "128",
        downloads: "1.2k",
        isPublic: true,
        completionPercentage: 100,
        difficulty: "advanced",
        teamSize: 3,
        duration: "6 months",
        client: "Tech Startup Inc.",
        awards: ["Best E-commerce Solution 2024"],
        tags: ["ecommerce", "fullstack", "react", "nodejs", "mongodb"]
      },
      {
        title: "Task Management App",
        subtitle: "Productivity & Collaboration Tool",
        slug: "task-management-app",
        description: "A modern task management application with team collaboration features, real-time updates, and intuitive user interface.",
        shortDescription: "Modern task management app with team collaboration and real-time updates.",
        category: "web",
        status: "completed",
        technologies: ["Vue.js", "Firebase", "Vuetify", "PWA"],
        features: ["Drag & Drop Interface", "Real-time Collaboration", "Multiple Views", "Deadline Tracking", "Team Management", "Offline Support"],
        githubUrl: "https://github.com/username/task-manager",
        liveUrl: "https://taskmanager-demo.com",
        featured: true,
        priority: 2,
        year: "2023",
        views: 180,
        likes: 32,
        isPublic: true,
        completionPercentage: 100,
        difficulty: "intermediate",
        teamSize: 2,
        tags: ["productivity", "vue", "firebase", "pwa", "collaboration"]
      }
    ];
    await Project.destroy({ where: {} });
    await Project.bulkCreate(sampleProjects);
    console.log(`✅ Added ${sampleProjects.length} projects`);
    
    // 3. Seed Art
    console.log('\n3/5 Seeding Art...');
    const sampleArtPieces = [
      {
        title: "Sakura Warrior",
        slug: "sakura-warrior",
        description: "An anime warrior character surrounded by cherry blossoms, showcasing dynamic poses and detailed armor design.",
        category: "Character Portrait",
        medium: "Paint Studio on PC",
        year: "2024",
        featured: true,
        priority: 1,
        dimensions: "1920x1080",
        tags: ["anime", "warrior", "sakura", "character", "portrait"],
        views: 150,
        likes: 25,
        isPublic: true,
      },
      {
        title: "Cyberpunk Cityscape",
        slug: "cyberpunk-cityscape",
        description: "A futuristic city with neon lights and flying vehicles, depicting a cyberpunk aesthetic.",
        category: "Landscape",
        medium: "Paint Studio on PC",
        year: "2024",
        featured: true,
        priority: 2,
        tags: ["cyberpunk", "city", "neon", "futuristic", "landscape"],
        views: 200,
        likes: 35,
        isPublic: true,
      }
    ];
    await Art.destroy({ where: {} });
    await Art.bulkCreate(sampleArtPieces);
    console.log(`✅ Added ${sampleArtPieces.length} art pieces`);
    
    // 4. Seed Education
    console.log('\n4/5 Seeding Education...');
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
    await Education.destroy({ where: {} });
    await Education.bulkCreate(educationData);
    console.log(`✅ Added ${educationData.length} education entries`);
    
    // 5. Seed Experience
    console.log('\n5/6 Seeding Experience...');
    const experienceData = [
      {
        title: "Senior Full Stack Developer",
        company: "TechCorp Solutions",
        period: "2022 - Present",
        location: "Remote",
        description: "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and architecting system solutions.",
        achievements: [
          "Increased application performance by 40%",
          "Led a team of 5 developers",
          "Implemented CI/CD pipelines"
        ],
        order: 1,
        isActive: true,
        isCurrent: true
      },
      {
        title: "Game Developer",
        company: "Indie Game Studio",
        period: "2021 - 2022",
        location: "Morocco",
        description: "Developed mobile and PC games using Unity and C#. Collaborated with artists and designers to create engaging gaming experiences.",
        achievements: [
          "Published 3 successful mobile games",
          "Achieved 100K+ downloads",
          "Implemented multiplayer functionality"
        ],
        order: 2,
        isActive: true,
        isCurrent: false
      }
    ];
    await Experience.destroy({ where: {} });
    await Experience.bulkCreate(experienceData);
    console.log(`✅ Added ${experienceData.length} experience entries`);
    
    // 6. Seed Tech Stack
    console.log('\n6/6 Seeding Tech Stack...');
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
    await TechStack.destroy({ where: {} });
    await TechStack.bulkCreate(techStackData);
    console.log(`✅ Added ${techStackData.length} tech stack entries`);

    console.log('\n✅ All seeding completed successfully!');
    console.log('🎉 Database is now fully populated with sample data');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run if called directly
if (require.main === module) {
  seedAll()
    .then(() => {
      console.log('\n🎉 Complete seeding process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Complete seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = seedAll;