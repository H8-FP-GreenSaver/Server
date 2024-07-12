"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    let categoryData = require("../db/categories.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();

      return el;
    });

    let plantData = require("../db/plants.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();

      return el;
    });

    let pestData = require("../db/pests.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();

      return el;
    });


    await queryInterface.bulkInsert("Categories", categoryData, {});
    await queryInterface.bulkInsert("Plants", plantData, {});
    await queryInterface.bulkInsert("Pests", pestData, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
    //  */
    await queryInterface.bulkDelete("Pests", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete("Plants", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await queryInterface.bulkDelete("Categories", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
