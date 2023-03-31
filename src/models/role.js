'use strict';
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('role', {
    id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      role_name: {
        allowNull: false,
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

  return Role;
};
