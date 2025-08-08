require('dotenv').config();
const { Project } = require('../models');

const sampleProjects = [
  {
    title: "E-Commerce Platform",
    subtitle: "Full-Stack Shopping Solution",
    slug: "ecommerce-platform",
    description: "A comprehensive e-commerce platform with advanced features including user authentication, payment processing, inventory management, and admin dashboard.",
    longDescription: "This e-commerce platform represents a complete solution for online retail businesses. Built with React and Node.js, it features a microservices architecture that ensures scalability and maintainability. The platform includes advanced features such as real-time inventory tracking, automated order processing, customer analytics, and a comprehensive admin panel for managing products, orders, and customers.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "JWT", "Redux", "Express", "Socket.io"],
    features: [
      "User Authentication & Authorization",
      "Product Catalog Management", 
      "Shopping Cart & Checkout",
      "Payment Processing (Stripe)",
      "Order Management System",
      "Admin Dashboard",
      "Real-time Inventory Tracking",
      "Email Notifications",
      "Responsive Design",
      "Search & Filtering"
    ],
    challenges: [
      "Implementing secure payment processing",
      "Real-time inventory synchronization", 
      "Optimizing database queries for large product catalogs",
      "Creating a scalable architecture"
    ],
    learnings: [
      "Advanced React patterns and state management",
      "Microservices architecture design",
      "Payment gateway integration",
      "Database optimization techniques"
    ],
    category: "web",
    year: "2025",
    status: "completed",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
    stars: "45",
    featured: true,
    priority: 10,
    difficulty: "advanced",
    teamSize: 1,
    duration: "3 months",
    completionPercentage: 100,
    tags: ["ecommerce", "fullstack", "react", "nodejs"],
    isPublic: true
  },
  {
    title: "Task Management App",
    subtitle: "Collaborative Productivity Tool",
    slug: "task-management-app",
    description: "A real-time collaborative task management application with team features, notifications, and advanced project tracking capabilities.",
    longDescription: "A comprehensive task management solution designed for teams and individuals. Features real-time collaboration, advanced project tracking, time management tools, and detailed analytics. Built with modern web technologies for optimal performance and user experience.",
    technologies: ["Vue.js", "Firebase", "Vuex", "CSS3", "PWA"],
    features: [
      "Real-time Collaboration",
      "Task Assignment & Tracking",
      "Project Management",
      "Time Tracking",
      "Team Chat",
      "File Attachments",
      "Progress Analytics",
      "Mobile App (PWA)",
      "Offline Support",
      "Custom Workflows"
    ],
    challenges: [
      "Real-time synchronization across multiple users",
      "Offline functionality implementation",
      "Complex state management",
      "Performance optimization for large datasets"
    ],
    learnings: [
      "Vue.js ecosystem and best practices",
      "Firebase real-time database",
      "Progressive Web App development",
      "Complex state management patterns"
    ],
    category: "web",
    year: "2025",
    status: "completed",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
    stars: "32",
    featured: false,
    priority: 8,
    difficulty: "intermediate",
    teamSize: 1,
    duration: "2 months",
    completionPercentage: 100,
    tags: ["productivity", "collaboration", "vue", "firebase"],
    isPublic: true
  },
  {
    title: "Pixel Adventure",
    subtitle: "2D Platformer Game",
    slug: "pixel-adventure",
    description: "An engaging 2D platformer with multiple levels, power-ups, smooth character controls, and retro-style pixel art graphics.",
    longDescription: "Pixel Adventure is a love letter to classic 2D platformers, combining nostalgic pixel art aesthetics with modern game design principles. The game features tight controls, challenging but fair level design, and a progression system that keeps players engaged. Each level introduces new mechanics and challenges, culminating in epic boss battles.",
    technologies: ["Unity", "C#", "2D Physics", "Animation", "Audio", "Tilemap"],
    features: [
      "20+ Challenging Levels",
      "Smooth Character Controls",
      "Enemy AI System",
      "Power-up System", 
      "Boss Battles",
      "Pixel Art Graphics",
      "Dynamic Soundtrack",
      "Achievement System",
      "Save/Load System",
      "Multiple Difficulty Modes"
    ],
    challenges: [
      "Creating responsive character controls",
      "Implementing efficient enemy AI",
      "Optimizing performance for mobile devices",
      "Balancing game difficulty"
    ],
    learnings: [
      "Unity 2D development best practices",
      "Game physics and collision detection",
      "Audio implementation and mixing",
      "Player experience and game feel"
    ],
    category: "game",
    year: "2025",
    status: "completed",
    downloads: "5K+",
    featured: true,
    priority: 9,
    difficulty: "intermediate",
    teamSize: 1,
    duration: "4 months",
    completionPercentage: 100,
    tags: ["platformer", "2d", "unity", "pixel-art"],
    isPublic: true
  },
  {
    title: "Fitness Tracker",
    subtitle: "Health & Wellness App",
    slug: "fitness-tracker",
    description: "A comprehensive fitness tracking app with workout plans, nutrition tracking, progress analytics, and social features for motivation.",
    longDescription: "The Fitness Tracker app is designed to be your complete wellness companion. It combines workout tracking, nutrition monitoring, and social features to create a comprehensive health platform. The app uses machine learning to provide personalized recommendations and integrates with various health APIs to give users a complete picture of their fitness journey.",
    technologies: ["React Native", "Expo", "Firebase", "Charts", "HealthKit", "AsyncStorage"],
    features: [
      "Workout Planning & Tracking",
      "Nutrition Logging",
      "Progress Analytics",
      "Social Features",
      "Health API Integration",
      "Custom Exercise Library",
      "Goal Setting & Tracking",
      "Offline Mode Support",
      "Push Notifications",
      "Data Export"
    ],
    challenges: [
      "Integrating with multiple health APIs",
      "Creating smooth animations on mobile",
      "Implementing offline data synchronization",
      "Optimizing battery usage"
    ],
    learnings: [
      "React Native development patterns",
      "Mobile app performance optimization",
      "Health data privacy considerations",
      "Cross-platform development challenges"
    ],
    category: "mobile",
    year: "2025",
    status: "completed",
    downloads: "2K+",
    featured: false,
    priority: 7,
    difficulty: "intermediate",
    teamSize: 1,
    duration: "3 months",
    completionPercentage: 100,
    tags: ["fitness", "health", "mobile", "react-native"],
    isPublic: true
  },
  {
    title: "Weather App",
    subtitle: "Beautiful Weather Forecasts",
    slug: "weather-app",
    description: "An elegant weather application with location-based forecasts, animated backgrounds, and detailed weather information.",
    longDescription: "A beautifully designed weather application that provides accurate forecasts with stunning visual presentations. Features location-based weather data, animated backgrounds that reflect current conditions, detailed hourly and weekly forecasts, and weather alerts.",
    technologies: ["Flutter", "Dart", "Weather API", "Animations", "Location"],
    features: [
      "Location-based Weather",
      "Hourly & Weekly Forecasts",
      "Animated Backgrounds",
      "Weather Alerts",
      "Multiple Locations",
      "Offline Caching",
      "Beautiful UI/UX",
      "Dark/Light Themes",
      "Widget Support",
      "Weather Maps"
    ],
    challenges: [
      "Creating smooth weather animations",
      "Handling location permissions",
      "Optimizing API calls",
      "Cross-platform consistency"
    ],
    learnings: [
      "Flutter development and animations",
      "Weather API integration",
      "Location services implementation",
      "Mobile UI/UX best practices"
    ],
    category: "mobile",
    year: "2024",
    status: "completed",
    downloads: "8K+",
    featured: true,
    priority: 8,
    difficulty: "beginner",
    teamSize: 1,
    duration: "1 month",
    completionPercentage: 100,
    tags: ["weather", "flutter", "mobile", "api"],
    isPublic: true
  },
  {
    title: "AI Chat Bot",
    subtitle: "Intelligent Conversation Assistant",
    slug: "ai-chat-bot",
    description: "An AI-powered chatbot with natural language processing, context awareness, and integration capabilities for various platforms.",
    longDescription: "A sophisticated AI chatbot built with modern NLP technologies. Features context-aware conversations, multi-platform integration, custom training capabilities, and advanced analytics. Designed for businesses to automate customer support and engagement.",
    technologies: ["Python", "TensorFlow", "NLP", "FastAPI", "Docker", "Redis"],
    features: [
      "Natural Language Processing",
      "Context-Aware Conversations",
      "Multi-platform Integration",
      "Custom Training",
      "Analytics Dashboard",
      "Real-time Responses",
      "Sentiment Analysis",
      "Multi-language Support",
      "API Integration",
      "Scalable Architecture"
    ],
    challenges: [
      "Training accurate NLP models",
      "Maintaining conversation context",
      "Scaling for high traffic",
      "Ensuring response accuracy"
    ],
    learnings: [
      "Machine learning and NLP",
      "Conversational AI design",
      "Scalable backend architecture",
      "Model training and optimization"
    ],
    category: "web",
    year: "2024",
    status: "in-progress",
    githubUrl: "https://github.com/example",
    featured: false,
    priority: 6,
    difficulty: "advanced",
    teamSize: 2,
    duration: "6 months",
    completionPercentage: 75,
    tags: ["ai", "chatbot", "nlp", "python"],
    isPublic: true
  }
];

async function seedProjects() {
  try {
    console.log('🌱 Seeding projects...');
    
    // Clear existing projects (optional - remove this in production)
    await Project.destroy({ where: {} });
    console.log('🗑️  Cleared existing projects');
    
    // Create sample projects
    for (const projectData of sampleProjects) {
      const project = await Project.create(projectData);
      console.log(`✅ Created project: ${project.title}`);
    }
    
    console.log(`🎉 Successfully seeded ${sampleProjects.length} projects!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
    process.exit(1);
  }
}

seedProjects();