const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Education = sequelize.define('Education', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  school: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.ENUM('Award', 'Code', 'Palette', 'Book', 'Certificate', 'GraduationCap'),
    allowNull: false,
    defaultValue: 'GraduationCap'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'education',
  hooks: {
    beforeCreate: (education) => {
      // Set order if not provided
      if (!education.order) {
        education.order = 0;
      }
    }
  }
});

module.exports = Education;