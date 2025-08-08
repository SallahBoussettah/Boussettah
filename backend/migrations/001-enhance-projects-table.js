const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns to projects table
    await queryInterface.addColumn("projects", "subtitle", {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("projects", "long_description", {
      type: DataTypes.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("projects", "demo_url", {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("projects", "thumbnail_url", {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("projects", "features", {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.addColumn("projects", "challenges", {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.addColumn("projects", "learnings", {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.addColumn("projects", "year", {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("projects", "stars", {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("projects", "downloads", {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("projects", "is_public", {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    });

    await queryInterface.addColumn("projects", "completion_percentage", {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    });

    await queryInterface.addColumn("projects", "difficulty", {
      type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
      allowNull: true,
    });

    await queryInterface.addColumn("projects", "team_size", {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    });

    await queryInterface.addColumn("projects", "duration", {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("projects", "client", {
      type: DataTypes.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("projects", "awards", {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    });

    await queryInterface.addColumn("projects", "tags", {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
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

    // Remove columns
    await queryInterface.removeColumn("projects", "subtitle");
    await queryInterface.removeColumn("projects", "long_description");
    await queryInterface.removeColumn("projects", "demo_url");
    await queryInterface.removeColumn("projects", "thumbnail_url");
    await queryInterface.removeColumn("projects", "features");
    await queryInterface.removeColumn("projects", "challenges");
    await queryInterface.removeColumn("projects", "learnings");
    await queryInterface.removeColumn("projects", "year");
    await queryInterface.removeColumn("projects", "stars");
    await queryInterface.removeColumn("projects", "downloads");
    await queryInterface.removeColumn("projects", "is_public");
    await queryInterface.removeColumn("projects", "completion_percentage");
    await queryInterface.removeColumn("projects", "difficulty");
    await queryInterface.removeColumn("projects", "team_size");
    await queryInterface.removeColumn("projects", "duration");
    await queryInterface.removeColumn("projects", "client");
    await queryInterface.removeColumn("projects", "awards");
    await queryInterface.removeColumn("projects", "tags");
  },
};
