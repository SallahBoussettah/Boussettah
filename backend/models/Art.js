const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Art = sequelize.define('Art', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM(
      'Digital Art', 
      'Character Portrait', 
      'Abstract', 
      'Landscape', 
      'Concept Art',
      'Illustration',
      'Pixel Art'
    ),
    allowNull: false,
    defaultValue: 'Digital Art'
  },
  medium: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Paint Studio on PC'
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: () => new Date().getFullYear().toString()
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  dimensions: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdYear: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'art_pieces',
  hooks: {
    beforeCreate: (art) => {
      if (!art.slug) {
        art.slug = art.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      if (art.year && !art.createdYear) {
        art.createdYear = parseInt(art.year);
      }
    },
    beforeUpdate: (art) => {
      if (art.changed('title') && !art.changed('slug')) {
        art.slug = art.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      if (art.changed('year') && art.year) {
        art.createdYear = parseInt(art.year);
      }
    }
  }
});

module.exports = Art;