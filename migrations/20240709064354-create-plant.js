'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Plants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      plantName: {
        type: Sequelize.STRING
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Categories",
          key: "id"
        }
      },
      estimatePrice: {
        type: Sequelize.INTEGER
      },
      estimateWater: {
        type: Sequelize.INTEGER
      },
      estimateTemperature: {
        type: Sequelize.INTEGER
      },
      difficulty: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      imageUrl: {
        type: Sequelize.TEXT
      },
      wateringTime: {
        type: Sequelize.INTEGER
      },
      medium: {
        type: Sequelize.STRING
      },
      plantArea: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('plants');
  }
};