require('dotenv').config();
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create tech_stacks table
    await queryInterface.createTable("tech_stacks", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 100],
        },
      },
      category: {
        type: DataTypes.ENUM('Frontend', 'Backend', 'Mobile', 'Game Dev', 'Design', 'Tools'),
        allowNull: false,
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
    await queryInterface.addIndex("tech_stacks", ["category"]);
    await queryInterface.addIndex("tech_stacks", ["is_active"]);
    await queryInterface.addIndex("tech_stacks", ["order"]);
    await queryInterface.addIndex("tech_stacks", ["created_at"]);
    await queryInterface.addIndex("tech_stacks", ["name"]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex("tech_stacks", ["category"]);
    await queryInterface.removeIndex("tech_stacks", ["is_active"]);
    await queryInterface.removeIndex("tech_stacks", ["order"]);
    await queryInterface.removeIndex("tech_stacks", ["created_at"]);
    await queryInterface.removeIndex("tech_stacks", ["name"]);

    // Drop the tech_stacks table
    await queryInterface.dropTable("tech_stacks");
  },
};