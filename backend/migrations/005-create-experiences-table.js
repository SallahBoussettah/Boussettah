require("dotenv").config();
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create experiences table
    await queryInterface.createTable("experiences", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      company: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      period: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 255],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      achievements: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      is_current: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
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
    await queryInterface.addIndex("experiences", ["is_active"]);
    await queryInterface.addIndex("experiences", ["is_current"]);
    await queryInterface.addIndex("experiences", ["order"]);
    await queryInterface.addIndex("experiences", ["created_at"]);
    await queryInterface.addIndex("experiences", ["company"]);
    await queryInterface.addIndex("experiences", ["title"]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex("experiences", ["is_active"]);
    await queryInterface.removeIndex("experiences", ["is_current"]);
    await queryInterface.removeIndex("experiences", ["order"]);
    await queryInterface.removeIndex("experiences", ["created_at"]);
    await queryInterface.removeIndex("experiences", ["company"]);
    await queryInterface.removeIndex("experiences", ["title"]);

    // Drop the experiences table
    await queryInterface.dropTable("experiences");
  },
};