require('dotenv').config();
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create art_pieces table
    await queryInterface.createTable("art_pieces", {
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
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
        defaultValue: 'Digital Art',
      },
      medium: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Paint Studio on PC',
      },
      year: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => new Date().getFullYear().toString(),
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      thumbnail_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      priority: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      dimensions: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_year: {
        type: DataTypes.INTEGER,
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
    await queryInterface.addIndex("art_pieces", ["category"]);
    await queryInterface.addIndex("art_pieces", ["featured"]);
    await queryInterface.addIndex("art_pieces", ["is_public"]);
    await queryInterface.addIndex("art_pieces", ["year"]);
    await queryInterface.addIndex("art_pieces", ["created_year"]);
    await queryInterface.addIndex("art_pieces", ["priority"]);
    await queryInterface.addIndex("art_pieces", ["views"]);
    await queryInterface.addIndex("art_pieces", ["likes"]);
    await queryInterface.addIndex("art_pieces", ["created_at"]);
    await queryInterface.addIndex("art_pieces", ["slug"]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex("art_pieces", ["category"]);
    await queryInterface.removeIndex("art_pieces", ["featured"]);
    await queryInterface.removeIndex("art_pieces", ["is_public"]);
    await queryInterface.removeIndex("art_pieces", ["year"]);
    await queryInterface.removeIndex("art_pieces", ["created_year"]);
    await queryInterface.removeIndex("art_pieces", ["priority"]);
    await queryInterface.removeIndex("art_pieces", ["views"]);
    await queryInterface.removeIndex("art_pieces", ["likes"]);
    await queryInterface.removeIndex("art_pieces", ["created_at"]);
    await queryInterface.removeIndex("art_pieces", ["slug"]);

    // Drop the art_pieces table
    await queryInterface.dropTable("art_pieces");
  },
};