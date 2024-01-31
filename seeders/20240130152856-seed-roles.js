'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const roles = [
      {
        name: 'Super Admin'
      },
      {
        name: 'Manager'
      }
    ]

    await queryInterface.bulkInsert('roles', roles);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles')
  }
};
