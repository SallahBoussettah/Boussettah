require('dotenv').config();
const { Art } = require('../models');

const sampleArtPieces = [
  {
    title: "Sakura Warrior",
    slug: "sakura-warrior",
    description: "An anime warrior character surrounded by cherry blossoms, showcasing dynamic poses and detailed armor design.",
    category: "Character Portrait",
    medium: "Paint Studio on PC",
    year: "2025",
    imageUrl: "/images/art/sakura-warrior.jpg",
    thumbnailUrl: "/images/art/thumbs/sakura-warrior.jpg",
    images: ["/images/art/sakura-warrior.jpg"],
    featured: true,
    priority: 10,
    dimensions: "1920x2400",
    tags: ["anime", "warrior", "sakura", "character", "armor"],
    views: 2100,
    likes: 142,
    isPublic: true,
    createdYear: 2025
  },
  {
    title: "Mystic Mage",
    slug: "mystic-mage",
    description: "A powerful anime mage character with flowing robes and magical energy effects, created during my early digital art journey.",
    category: "Character Portrait",
    medium: "Paint Studio X",
    year: "2024",
    imageUrl: "/images/art/mystic-mage.jpg",
    thumbnailUrl: "/images/art/thumbs/mystic-mage.jpg",
    images: ["/images/art/mystic-mage.jpg"],
    featured: false,
    priority: 8,
    dimensions: "1600x2000",
    tags: ["anime", "mage", "magic", "fantasy", "robes"],
    views: 1800,
    likes: 89,
    isPublic: true,
    createdYear: 2024
  },
  {
    title: "Cyberpunk Heroine",
    slug: "cyberpunk-heroine",
    description: "A futuristic anime character with cyberpunk aesthetics, featuring neon accents and high-tech accessories.",
    category: "Character Portrait",
    medium: "Paint Studio on PC",
    year: "2025",
    imageUrl: "/images/art/cyberpunk-heroine.jpg",
    thumbnailUrl: "/images/art/thumbs/cyberpunk-heroine.jpg",
    images: ["/images/art/cyberpunk-heroine.jpg"],
    featured: true,
    priority: 9,
    dimensions: "1920x1080",
    tags: ["anime", "cyberpunk", "futuristic", "neon", "tech"],
    views: 3200,
    likes: 203,
    isPublic: true,
    createdYear: 2025
  },
  {
    title: "Forest Guardian",
    slug: "forest-guardian",
    description: "A mystical character protecting the ancient forest, with nature-inspired design elements and earth tones.",
    category: "Character Portrait",
    medium: "Paint Studio on PC",
    year: "2025",
    imageUrl: "/images/art/forest-guardian.jpg",
    thumbnailUrl: "/images/art/thumbs/forest-guardian.jpg",
    images: ["/images/art/forest-guardian.jpg"],
    featured: false,
    priority: 7,
    dimensions: "1600x2400",
    tags: ["anime", "nature", "guardian", "forest", "mystical"],
    views: 1500,
    likes: 76,
    isPublic: true,
    createdYear: 2025
  },
  {
    title: "Dragon Slayer",
    slug: "dragon-slayer",
    description: "An epic battle scene featuring a brave warrior facing a mighty dragon, with dynamic action and dramatic lighting.",
    category: "Concept Art",
    medium: "Paint Studio on PC",
    year: "2024",
    imageUrl: "/images/art/dragon-slayer.jpg",
    thumbnailUrl: "/images/art/thumbs/dragon-slayer.jpg",
    images: ["/images/art/dragon-slayer.jpg"],
    featured: true,
    priority: 9,
    dimensions: "2560x1440",
    tags: ["anime", "dragon", "warrior", "battle", "epic"],
    views: 4200,
    likes: 298,
    isPublic: true,
    createdYear: 2024
  },
  {
    title: "Neon Dreams",
    slug: "neon-dreams",
    description: "An abstract digital art piece exploring vibrant neon colors and geometric patterns in a dreamlike composition.",
    category: "Abstract",
    medium: "Paint Studio on PC",
    year: "2025",
    imageUrl: "/images/art/neon-dreams.jpg",
    thumbnailUrl: "/images/art/thumbs/neon-dreams.jpg",
    images: ["/images/art/neon-dreams.jpg"],
    featured: false,
    priority: 6,
    dimensions: "1920x1920",
    tags: ["abstract", "neon", "geometric", "digital", "colorful"],
    views: 980,
    likes: 54,
    isPublic: true,
    createdYear: 2025
  },
  {
    title: "Ocean Priestess",
    slug: "ocean-priestess",
    description: "A serene anime character with ocean-themed design, flowing blue hair, and water magic elements.",
    category: "Character Portrait",
    medium: "Paint Studio X",
    year: "2024",
    imageUrl: "/images/art/ocean-priestess.jpg",
    thumbnailUrl: "/images/art/thumbs/ocean-priestess.jpg",
    images: ["/images/art/ocean-priestess.jpg"],
    featured: false,
    priority: 7,
    dimensions: "1600x2000",
    tags: ["anime", "ocean", "priestess", "water", "magic"],
    views: 1650,
    likes: 112,
    isPublic: true,
    createdYear: 2024
  },
  {
    title: "Pixel Adventure Hero",
    slug: "pixel-adventure-hero",
    description: "A retro-style pixel art character design for a platformer game, featuring classic 16-bit aesthetics.",
    category: "Pixel Art",
    medium: "Paint Studio on PC",
    year: "2025",
    imageUrl: "/images/art/pixel-hero.jpg",
    thumbnailUrl: "/images/art/thumbs/pixel-hero.jpg",
    images: ["/images/art/pixel-hero.jpg"],
    featured: false,
    priority: 5,
    dimensions: "512x512",
    tags: ["pixel", "retro", "game", "character", "16bit"],
    views: 720,
    likes: 43,
    isPublic: true,
    createdYear: 2025
  },
  {
    title: "Starlight Archer",
    slug: "starlight-archer",
    description: "An elegant anime archer character with celestial themes, featuring star-decorated bow and cosmic background.",
    category: "Character Portrait",
    medium: "Paint Studio on PC",
    year: "2025",
    imageUrl: "/images/art/starlight-archer.jpg",
    thumbnailUrl: "/images/art/thumbs/starlight-archer.jpg",
    images: ["/images/art/starlight-archer.jpg"],
    featured: true,
    priority: 8,
    dimensions: "1600x2400",
    tags: ["anime", "archer", "celestial", "stars", "bow"],
    views: 2800,
    likes: 187,
    isPublic: true,
    createdYear: 2025
  },
  {
    title: "Urban Landscape",
    slug: "urban-landscape",
    description: "A detailed cityscape illustration with modern architecture and atmospheric lighting effects.",
    category: "Landscape",
    medium: "Paint Studio on PC",
    year: "2024",
    imageUrl: "/images/art/urban-landscape.jpg",
    thumbnailUrl: "/images/art/thumbs/urban-landscape.jpg",
    images: ["/images/art/urban-landscape.jpg"],
    featured: false,
    priority: 6,
    dimensions: "2560x1080",
    tags: ["landscape", "urban", "city", "architecture", "digital"],
    views: 1200,
    likes: 68,
    isPublic: true,
    createdYear: 2024
  }
];

async function seedArt() {
  try {
    console.log('🎨 Seeding art pieces...');
    
    // Clear existing art pieces (optional - remove this in production)
    await Art.destroy({ where: {} });
    console.log('🗑️  Cleared existing art pieces');
    
    // Create sample art pieces
    for (const artData of sampleArtPieces) {
      const artPiece = await Art.create(artData);
      console.log(`✅ Created art piece: ${artPiece.title}`);
    }
    
    console.log(`🎉 Successfully seeded ${sampleArtPieces.length} art pieces!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding art pieces:', error);
    process.exit(1);
  }
}

seedArt();