require('dotenv').config();
const { Art } = require('../models');

const sampleArtPieces = [
  {
    title: "Hataki Kakashi",
    slug: "hataki-kakashi",
    description: "Kakashi from naruto",
    category: "Anime Character",
    medium: "Digital Art",
    year: "2023",
    featured: true,
    priority: 1,
    tags: ["anime", "digital", "illustration", "concept art", "naruto", "kakashi"],
    views: 180,
    likes: 42,
    isPublic: true,
    createdDate: "2023-03-24"
  },
  {
    title: "Satoru Gojo",
    slug: "satoru-gojo",
    description: "Gojo from jujutsu kaisen",
    category: "Anime Character",
    medium: "Digital Art",
    year: "2025",
    featured: true,
    priority: 2,
    tags: ["anime", "digital", "illustration", "concept art", "jujutsu kaisen", "gojo"],
    views: 220,
    likes: 58,
    isPublic: true,
    createdDate: "2025-02-21"
  },
  {
    title: "Pink Gaze",
    slug: "pink-gaze",
    description: "Anime character sketch",
    category: "Character Sketch",
    medium: "Digital Art",
    year: "2025",
    featured: true,
    priority: 3,
    tags: ["anime", "digital", "illustration", "concept art", "sketch"],
    views: 95,
    likes: 28,
    isPublic: true,
    createdDate: "2025-03-16"
  },
  {
    title: "Ryomen Sukuna",
    slug: "ryomen-sukuna",
    description: "Sukuna from jujutsu kaisen",
    category: "Anime Character",
    medium: "Digital Art",
    year: "2023",
    featured: true,
    priority: 4,
    tags: ["jujutsu kaisen", "antagonist", "anime character", "manga", "digital art", "sukuna"],
    views: 165,
    likes: 45,
    isPublic: true,
    createdDate: "2023-08-15"
  },
  {
    title: "Igris",
    slug: "igris",
    description: "Shadow soldier from solo leveling",
    category: "Anime Character",
    medium: "Digital Art",
    year: "2024",
    featured: false,
    priority: 5,
    tags: ["solo leveling", "shadow soldier", "knight", "webtoon", "digital art"],
    views: 140,
    likes: 38,
    isPublic: true,
    createdDate: "2024-02-28"
  },
  {
    title: "Sung Jin-Woo",
    slug: "sung-jin-woo",
    description: "Main character from solo leveling",
    category: "Anime Character",
    medium: "Digital Art",
    year: "2024",
    featured: false,
    priority: 6,
    tags: ["solo leveling", "protagonist", "hunter", "webtoon", "digital art"],
    views: 155,
    likes: 41,
    isPublic: true,
    createdDate: "2024-02-16"
  },
  {
    title: "Enel",
    slug: "enel",
    description: "God from one piece",
    category: "Anime Character",
    medium: "Digital Art",
    year: "2023",
    featured: false,
    priority: 7,
    tags: ["one piece", "antagonist", "god", "lightning", "digital art"],
    views: 125,
    likes: 32,
    isPublic: true,
    createdDate: "2023-04-05"
  },
  {
    title: "Itachi Uchiha",
    slug: "itachi-uchiha",
    description: "Itachi from naruto",
    category: "Anime Character",
    medium: "Digital Art",
    year: "2024",
    featured: false,
    priority: 8,
    tags: ["naruto", "akatsuki", "uchiha clan", "sharingan", "digital art"],
    views: 190,
    likes: 52,
    isPublic: true,
    createdDate: "2024-06-02"
  },
  {
    title: "Killua Zoldyck",
    slug: "killua-zoldyck",
    description: "Killua from hunter x hunter",
    category: "Anime Character",
    medium: "Digital Art",
    year: "2024",
    featured: false,
    priority: 9,
    tags: ["hunter x hunter", "zoldyck clan", "scarlet eyes", "anime character", "digital art"],
    views: 135,
    likes: 36,
    isPublic: true,
    createdDate: "2024-07-06"
  },
  {
    title: "Naruto Uzumaki",
    slug: "naruto-uzumaki",
    description: "Naruto from naruto (As simple as that)",
    category: "Anime Character",
    medium: "Digital Art",
    year: "2024",
    featured: false,
    priority: 10,
    tags: ["naruto", "protagonist", "ninja", "hokage", "digital art"],
    views: 200,
    likes: 55,
    isPublic: true,
    createdDate: "2024-10-18"
  },
  {
    title: "Shoto Todoroki",
    slug: "shoto-todoroki",
    description: "Todoroki from my hero academia",
    category: "Anime Character",
    medium: "Digital Art",
    year: "2024",
    featured: false,
    priority: 11,
    tags: ["my hero academia", "hero", "dual quirk", "student", "digital art"],
    views: 145,
    likes: 39,
    isPublic: true,
    createdDate: "2024-04-03"
  },
  {
    title: "Monkey D. Luffy Gear 5",
    slug: "luffy-gear-5",
    description: "Luffy gear 5 from one piece",
    category: "Anime Character",
    medium: "Digital Art",
    year: "2023",
    featured: true,
    priority: 12,
    tags: ["one piece", "gear 5", "nika", "awakening", "digital art", "luffy"],
    views: 250,
    likes: 68,
    isPublic: true,
    createdDate: "2023-08-05"
  },
  {
    title: "Sukuna and Renji Abarai",
    slug: "sukuna-renji-crossover",
    description: "Sukuna and Renji from jujutsu kaisen and bleach",
    category: "Crossover Art",
    medium: "Digital Art",
    year: "2023",
    featured: false,
    priority: 13,
    tags: ["jujutsu kaisen", "bleach", "crossover", "antagonist", "digital art"],
    views: 175,
    likes: 47,
    isPublic: true,
    createdDate: "2023-06-08"
  },
  {
    title: "Tetsuya Kuroko",
    slug: "tetsuya-kuroko",
    description: "Kuroko from kuroko's basketball",
    category: "Sports Anime",
    medium: "Digital Art",
    year: "2023",
    featured: false,
    priority: 14,
    tags: ["kuroko's basketball", "phantom sixth man", "sports anime", "basketball", "digital art"],
    views: 110,
    likes: 29,
    isPublic: true,
    createdDate: "2023-06-08"
  },
  {
    title: "Yamato",
    slug: "yamato",
    description: "Yamato from one piece",
    category: "Anime Character",
    medium: "Digital Art",
    year: "2024",
    featured: false,
    priority: 15,
    tags: ["one piece", "samurai", "wano", "straw hat ally", "digital art"],
    views: 130,
    likes: 35,
    isPublic: true,
    createdDate: "2024-11-05"
  },
  {
    title: "Ken Kaneki",
    slug: "ken-kaneki",
    description: "Kaneki from tokyo ghoul",
    category: "Anime Character",
    medium: "Digital Art",
    year: "2023",
    featured: false,
    priority: 16,
    tags: ["tokyo ghoul", "protagonist", "ghoul", "mask", "digital art"],
    views: 160,
    likes: 43,
    isPublic: true,
    createdDate: "2023-08-16"
  },
  {
    title: "Blue Lock Characters",
    slug: "blue-lock-characters",
    description: "Characters from blue lock",
    category: "Sports Anime",
    medium: "Digital Art",
    year: "2023",
    featured: false,
    priority: 17,
    tags: ["blue lock", "soccer", "sports anime", "team", "digital art"],
    views: 120,
    likes: 31,
    isPublic: true,
    createdDate: "2023-01-30"
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