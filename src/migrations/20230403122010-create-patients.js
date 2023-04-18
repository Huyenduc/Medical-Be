'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('patients', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      weight: {
        type: Sequelize.STRING,
      },
      health_insurance_number: {
        unique: true,
        type: Sequelize.STRING
      },
      height: {
        type: Sequelize.STRING
      },
      user_id: {
        allowNull: false,
        unique: true,
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_blood_groups: {
        type: Sequelize.UUID,
        references: {
          model: 'bloodGroups',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
      }
    })
  },

  async down(queryInterface, Sequelize) {

  }
};
