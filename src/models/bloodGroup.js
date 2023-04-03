'use strict';
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BloodGroup = sequelize.define('bloodGroup', {
    id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      blood_name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
  }, {

  });

  return BloodGroup;
};
