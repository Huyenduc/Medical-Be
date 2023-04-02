'use strict';
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Degree = sequelize.define('degree', {
    id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      abbreviation:{
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

  return Degree;
};
