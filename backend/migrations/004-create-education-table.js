require('dotenv').config();
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create education table
    await queryInterface.createTable("education", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      school: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      year: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 50],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon: {
        type: DataTypes.ENUM('Award', 'Code', 'Palette', 'Book', 'Certificate', 'GraduationCap'),
        allowNull: false,
        defaultValue: 'GraduationCap',
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add indexes for better performance
    await queryInterface.addIndex("education", ["is_active"]);
    await queryInterface.addIndex("education", ["order"]);
    await queryInterface.addIndex("education", ["created_at"]);
    await queryInterface.addIndex("education", ["school"]);
    await queryInterface.addIndex("education", ["degree"]);
    await queryInterface.addIndex("education", ["year"]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex("education", ["is_active"]);
    await queryInterface.removeIndex("education", ["order"]);
    await queryInterface.removeIndex("education", ["created_at"]);
    await queryInterface.removeIndex("education", ["school"]);
    await queryInterface.removeIndex("education", ["degree"]);
    await queryInterface.removeIndex("education", ["year"]);

    // Drop the education table
    await queryInterface.dropTable("education");
  },
};