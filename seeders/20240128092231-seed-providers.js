'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const providers = [
      {
        name: 'email',
      }
    ];

    await queryInterface.bulkInsert('providers', providers);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('providers')
  }
};