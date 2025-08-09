require('dotenv').config();
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create admins table
    await queryInterface.createTable("admins", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        defaultValue: 'admin',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: true,
      },
      reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Temporary token for password reset verification'
      },
      reset_token_expiry: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Expiration time for password reset token'
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
    await queryInterface.addIndex("admins", ["username"]);
    await queryInterface.addIndex("admins", ["email"]);
    await queryInterface.addIndex("admins", ["is_active"]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex("admins", ["username"]);
    await queryInterface.removeIndex("admins", ["email"]);
    await queryInterface.removeIndex("admins", ["is_active"]);

    // Drop the admins table
    await queryInterface.dropTable("admins");
  },
};