const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('admins', 'resetToken', {
      type: DataTypes.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('admins', 'resetTokenExpiry', {
      type: DataTypes.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('admins', 'resetToken');
    await queryInterface.removeColumn('admins', 'resetTokenExpiry');
  }
};