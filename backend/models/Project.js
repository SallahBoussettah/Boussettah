const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('Project', {
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
  subtitle: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 255]
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
  longDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  shortDescription: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('web', 'mobile', 'game', 'desktop'),
    allowNull: false,
    defaultValue: 'web'
  },
  status: {
    type: DataTypes.ENUM('planning', 'in-progress', 'completed', 'on-hold'),
    allowNull: false,
    defaultValue: 'planning'
  },
  technologies: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  githubUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  liveUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  demoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
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
  features: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  challenges: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  learnings: {
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
  year: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [4, 4]
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  stars: {
    type: DataTypes.STRING,
    allowNull: true
  },
  downloads: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  completionPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: true
  },
  teamSize: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true
  },
  client: {
    type: DataTypes.STRING,
    allowNull: true
  },
  awards: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  }
}, {
  tableName: 'projects',
  hooks: {
    beforeCreate: (project) => {
      if (!project.slug) {
        project.slug = project.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      // Set year from startDate if not provided
      if (!project.year && project.startDate) {
        project.year = new Date(project.startDate).getFullYear().toString();
      }
      // Set completion percentage based on status
      if (!project.completionPercentage) {
        switch (project.status) {
          case 'completed':
            project.completionPercentage = 100;
            break;
          case 'in-progress':
            project.completionPercentage = 50;
            break;
          case 'planning':
            project.completionPercentage = 10;
            break;
          default:
            project.completionPercentage = 0;
        }
      }
    },
    beforeUpdate: (project) => {
      if (project.changed('title') && !project.changed('slug')) {
        project.slug = project.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      // Update year from startDate if changed
      if (project.changed('startDate') && project.startDate && !project.changed('year')) {
        project.year = new Date(project.startDate).getFullYear().toString();
      }
      // Update completion percentage based on status
      if (project.changed('status') && !project.changed('completionPercentage')) {
        switch (project.status) {
          case 'completed':
            project.completionPercentage = 100;
            break;
          case 'in-progress':
            project.completionPercentage = Math.max(project.completionPercentage || 0, 50);
            break;
          case 'planning':
            project.completionPercentage = Math.max(project.completionPercentage || 0, 10);
            break;
        }
      }
    }
  }
});

module.exports = Project;