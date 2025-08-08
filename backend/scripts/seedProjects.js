require('dotenv').config();
const { Project } = require('../models');

const sampleProjects = [
  {
    title: "E-Commerce Platform",
    subtitle: "Full-Stack Shopping Solution",
    slug: "ecommerce-platform",
    description: "A comprehensive e-commerce platform with advanced features including user authentication, payment processing, inventory management, and admin dashboard.",
    longDescription: "This e-commerce platform represents a complete solution for online retail businesses. Built with React and Node.js, it features a microservices architecture that ensures scalability and maintainability. The platform includes advanced features such as real-time inventory tracking, automated order processing, customer analytics, and a comprehensive admin panel for managing products, orders, and customers.",
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
    longDescription: "This task management application is designed to enhance productivity and streamline team collaboration. Built with modern web technologies, it offers features like drag-and-drop task organization, real-time collaboration, deadline tracking, and comprehensive reporting. The application supports multiple project views including Kanban boards, calendar view, and list view.",
    shortDescription: "Modern task management app with team collaboration and real-time updates.",
    category: "web",
    status: "completed",
    technologies: ["Vue.js", "Firebase", "Vuetify", "PWA"],
    features: ["Drag & Drop Interface", "Real-time Collaboration", "Multiple Views", "Deadline Tracking", "Team Management", "Offline Support"],
    challenges: ["Real-time Synchronization", "Offline Functionality", "Performance Optimization"],
    learnings: ["Vue.js Ecosystem", "Firebase Integration", "PWA Development", "Real-time Data Sync"],
    githubUrl: "https://github.com/username/task-manager",
    liveUrl: "https://taskmanager-demo.com",
    featured: true,
    priority: 2,
    year: "2023",
    startDate: "2023-08-01",
    endDate: "2023-12-15",
    views: 180,
    likes: 32,
    stars: "89",
    downloads: "800",
    isPublic: true,
    completionPercentage: 100,
    difficulty: "intermediate",
    teamSize: 2,
    duration: "4.5 months",
    tags: ["productivity", "vue", "firebase", "pwa", "collaboration"]
  },
  {
    title: "Mobile Weather App",
    subtitle: "React Native Weather Forecast",
    slug: "mobile-weather-app",
    description: "A beautiful weather application for iOS and Android with detailed forecasts, location-based weather, and interactive maps.",
    longDescription: "This cross-platform mobile weather application provides users with accurate weather forecasts and real-time weather data. Built with React Native, it features a clean and intuitive interface, location-based weather detection, detailed 7-day forecasts, weather maps, and customizable notifications for weather alerts.",
    shortDescription: "Cross-platform weather app with forecasts, maps, and location-based features.",
    category: "mobile",
    status: "completed",
    technologies: ["React Native", "Expo", "Weather API", "Maps API", "AsyncStorage"],
    features: ["Location Detection", "7-Day Forecast", "Weather Maps", "Push Notifications", "Offline Caching", "Multiple Locations"],
    challenges: ["API Integration", "Location Services", "Performance Optimization", "Cross-platform Compatibility"],
    learnings: ["React Native Development", "Mobile UI/UX", "API Integration", "Location Services"],
    githubUrl: "https://github.com/username/weather-app",
    featured: false,
    priority: 3,
    year: "2023",
    startDate: "2023-05-01",
    endDate: "2023-07-30",
    views: 120,
    likes: 28,
    stars: "67",
    downloads: "2.1k",
    isPublic: true,
    completionPercentage: 100,
    difficulty: "intermediate",
    teamSize: 1,
    duration: "3 months",
    tags: ["mobile", "react-native", "weather", "maps", "api"]
  },
  {
    title: "2D Platformer Game",
    subtitle: "Unity Adventure Game",
    slug: "2d-platformer-game",
    description: "A classic 2D platformer game built with Unity, featuring multiple levels, power-ups, and engaging gameplay mechanics.",
    longDescription: "This 2D platformer game combines classic gameplay mechanics with modern design principles. Built using Unity and C#, it features multiple themed levels, various enemy types, collectible power-ups, and smooth character controls. The game includes a level editor, achievement system, and local multiplayer support.",
    shortDescription: "Classic 2D platformer with Unity, featuring multiple levels and power-ups.",
    category: "game",
    status: "in-progress",
    technologies: ["Unity", "C#", "Photoshop", "Audacity"],
    features: ["Multiple Levels", "Power-up System", "Enemy AI", "Level Editor", "Achievement System", "Local Multiplayer"],
    challenges: ["Physics Implementation", "Level Design", "Performance Optimization", "Audio Integration"],
    learnings: ["Unity Development", "Game Physics", "Level Design", "Audio Programming"],
    githubUrl: "https://github.com/username/platformer-game",
    featured: false,
    priority: 4,
    year: "2024",
    startDate: "2024-03-01",
    views: 95,
    likes: 22,
    stars: "34",
    isPublic: true,
    completionPercentage: 75,
    difficulty: "advanced",
    teamSize: 2,
    duration: "8 months",
    tags: ["game", "unity", "2d", "platformer", "csharp"]
  },
  {
    title: "Portfolio Website",
    subtitle: "Personal Developer Portfolio",
    slug: "portfolio-website",
    description: "A modern, responsive portfolio website showcasing projects, skills, and experience with dynamic content management.",
    longDescription: "This portfolio website serves as a comprehensive showcase of development skills and projects. Built with Next.js and featuring a custom CMS, it includes dynamic project galleries, an integrated blog, contact forms, and admin panel for content management. The site is optimized for performance and SEO.",
    shortDescription: "Modern portfolio website with Next.js and dynamic content management.",
    category: "web",
    status: "completed",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "PostgreSQL"],
    features: ["Dynamic Content", "Admin Panel", "Blog System", "Contact Forms", "SEO Optimization", "Dark Mode"],
    challenges: ["Performance Optimization", "SEO Implementation", "Content Management", "Animation Performance"],
    learnings: ["Next.js Framework", "TypeScript", "Animation Libraries", "SEO Best Practices"],
    githubUrl: "https://github.com/username/portfolio",
    liveUrl: "https://portfolio-demo.com",
    featured: true,
    priority: 5,
    year: "2024",
    startDate: "2024-07-01",
    endDate: "2024-08-15",
    views: 300,
    likes: 55,
    stars: "156",
    isPublic: true,
    completionPercentage: 100,
    difficulty: "intermediate",
    teamSize: 1,
    duration: "1.5 months",
    tags: ["portfolio", "nextjs", "typescript", "tailwind", "cms"]
  }
];

const seedProjects = async () => {
  try {
    console.log('💼 Seeding projects...');

    // Connect to database
    const { sequelize } = require('../config/database');
    await sequelize.authenticate();
    console.log('📡 Database connected successfully');

    // Clear existing projects
    await Project.destroy({ where: {} });

    // Insert sample projects
    await Project.bulkCreate(sampleProjects);

    console.log('✅ Projects seeded successfully!');
    console.log(`🚀 Added ${sampleProjects.length} projects`);

  } catch (error) {
    console.error('❌ Error seeding projects:', error);
    throw error;
  } finally {
    const { sequelize } = require('../config/database');
    await sequelize.close();
  }
};

// Run if called directly
if (require.main === module) {
  seedProjects()
    .then(() => {
      console.log('🎉 Projects seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Projects seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedProjects;