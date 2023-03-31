'use strict';

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('user', {
    id: {
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    firstname: {
      allowNull: true,
      type: Sequelize.STRING
    },
    lastname: {
      allowNull: true,
      type: Sequelize.STRING
    },
    user_name: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    avatar: {
      allowNull: true,
      type: Sequelize.BLOB
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true
    },
    gender: {
      allowNull: true,
      type: Sequelize.STRING
    },
    phone: {
      allowNull: true,
      type: Sequelize.STRING
    },
    date_of_birth: {
      allowNull: true,
      type: Sequelize.DATE
    },
    address: {
      allowNull: true,
      type: Sequelize.STRING
    },
    status: {
      allowNull: true,
      type: Sequelize.BOOLEAN
    },
    roleId: {
      allowNull: false,
      type: Sequelize.UUID,
      references: {
        model: 'roles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {

  });

  User.associate = function(models) {
    User.belongsTo(models.role, { foreignKey: 'roleId' });
  };

  return User;
};
