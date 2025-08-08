require('dotenv').config();
const { Art } = require('../models');

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
    dimensions: "2560x1440",
    tags: ["cyberpunk", "city", "neon", "futuristic", "landscape"],
    views: 200,
    likes: 35,
    isPublic: true,
  },
  {
    title: "Abstract Flow",
    slug: "abstract-flow",
    description: "A colorful abstract composition with flowing shapes and vibrant gradients.",
    category: "Abstract",
    medium: "Paint Studio on PC",
    year: "2023",
    featured: false,
    priority: 3,
    dimensions: "1080x1080",
    tags: ["abstract", "colorful", "flow", "gradients"],
    views: 80,
    likes: 12,
    isPublic: true,
  },
  {
    title: "Dragon Concept",
    slug: "dragon-concept",
    description: "Concept art for a fantasy dragon with detailed scales and wings.",
    category: "Concept Art",
    medium: "Paint Studio on PC",
    year: "2023",
    featured: false,
    priority: 4,
    dimensions: "1920x1080",
    tags: ["dragon", "fantasy", "concept", "creature"],
    views: 120,
    likes: 18,
    isPublic: true,
  },
  {
    title: "Pixel Adventure",
    slug: "pixel-adventure",
    description: "A retro-style pixel art scene with adventure game aesthetics.",
    category: "Pixel Art",
    medium: "Paint Studio on PC",
    year: "2023",
    featured: false,
    priority: 5,
    dimensions: "640x480",
    tags: ["pixel", "retro", "adventure", "game"],
    views: 95,
    likes: 15,
    isPublic: true,
  }
];

const seedArt = async () => {
  try {
    console.log('🎨 Seeding art pieces...');

    // Connect to database
    const { sequelize } = require('../config/database');
    await sequelize.authenticate();
    console.log('📡 Database connected successfully');

    // Clear existing art pieces
    await Art.destroy({ where: {} });

    // Insert sample art pieces
    await Art.bulkCreate(sampleArtPieces);

    console.log('✅ Art pieces seeded successfully!');
    console.log(`🖼️  Added ${sampleArtPieces.length} art pieces`);

  } catch (error) {
    console.error('❌ Error seeding art pieces:', error);
    throw error;
  } finally {
    const { sequelize } = require('../config/database');
    await sequelize.close();
  }
};

// Run if called directly
if (require.main === module) {
  seedArt()
    .then(() => {
      console.log('🎉 Art seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Art seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedArt;