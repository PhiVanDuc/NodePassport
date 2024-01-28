'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcrypt');
const { Provider } = require('../models/index');
module.exports = {
  async up (queryInterface, Sequelize) {
    const id = await Provider.max('id');

    const salt = bcrypt.genSaltSync(10);
    const users = [
      {
        provider_id: +id,
        name: 'Phí Văn Đức',
        email: 'phid808@gmail.com',
        password: bcrypt.hashSync('123456', salt),
        status: true,
      }
    ];

    await queryInterface.bulkInsert('users', users);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users')
  }
};