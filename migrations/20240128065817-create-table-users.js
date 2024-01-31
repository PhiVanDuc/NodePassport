'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      provider_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "providers",
          },
          key: "id",
        }
      },
      name: {
        type: Sequelize.STRING(),
      },
      email: {
        type: Sequelize.STRING(),
      },
      password: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};