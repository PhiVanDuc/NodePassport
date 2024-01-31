'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const user_role = [
      {
        user_id: 1,
        role_id: 1,
      },
    ]

    queryInterface.bulkInsert('user_role', user_role);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_role')
  }
};
