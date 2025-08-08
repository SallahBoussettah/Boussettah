require('dotenv').config();
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create projects table
    await queryInterface.createTable("projects", {
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
      subtitle: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 255],
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
      long_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      short_description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      category: {
        type: DataTypes.ENUM('web', 'mobile', 'game', 'desktop'),
        allowNull: false,
        defaultValue: 'web',
      },
      status: {
        type: DataTypes.ENUM('planning', 'in-progress', 'completed', 'on-hold'),
        allowNull: false,
        defaultValue: 'planning',
      },
      technologies: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      github_url: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      live_url: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      demo_url: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
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
      features: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      challenges: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      learnings: {
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
      year: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [4, 4],
        },
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      stars: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      downloads: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      completion_percentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 100,
        },
      },
      difficulty: {
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        allowNull: true,
      },
      team_size: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      client: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      awards: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
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
    await queryInterface.addIndex("projects", ["category"]);
    await queryInterface.addIndex("projects", ["status"]);
    await queryInterface.addIndex("projects", ["featured"]);
    await queryInterface.addIndex("projects", ["is_public"]);
    await queryInterface.addIndex("projects", ["year"]);
    await queryInterface.addIndex("projects", ["priority"]);
    await queryInterface.addIndex("projects", ["views"]);
    await queryInterface.addIndex("projects", ["likes"]);
    await queryInterface.addIndex("projects", ["created_at"]);
    await queryInterface.addIndex("projects", ["slug"]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex("projects", ["category"]);
    await queryInterface.removeIndex("projects", ["status"]);
    await queryInterface.removeIndex("projects", ["featured"]);
    await queryInterface.removeIndex("projects", ["is_public"]);
    await queryInterface.removeIndex("projects", ["year"]);
    await queryInterface.removeIndex("projects", ["priority"]);
    await queryInterface.removeIndex("projects", ["views"]);
    await queryInterface.removeIndex("projects", ["likes"]);
    await queryInterface.removeIndex("projects", ["created_at"]);
    await queryInterface.removeIndex("projects", ["slug"]);

    // Drop the projects table
    await queryInterface.dropTable("projects");
  },
};