const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TechStack = sequelize.define('TechStack', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  category: {
    type: DataTypes.ENUM('Frontend', 'Backend', 'Mobile', 'Game Dev', 'Design', 'Tools'),
    allowNull: false
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
  tableName: 'tech_stacks',
  hooks: {
    beforeCreate: (techStack) => {
      // Set order if not provided
      if (!techStack.order) {
        techStack.order = 0;
      }
    }
  }
});

module.exports = TechStack;