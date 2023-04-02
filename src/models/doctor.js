'use strict';

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Doctor = sequelize.define('doctor', {
        id: {
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            type: Sequelize.UUID
        },
        specialty: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        license_number: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        about: {
            type: Sequelize.STRING
        },
        exp: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        rating: {
            type: Sequelize.INTEGER
        },
        user_id: {
            allowNull: false,
            type: Sequelize.UUID,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        id_workplace: {
            allowNull: false,
            type: Sequelize.UUID,
            references: {
                model: 'workplaces',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        id_degree: {
            allowNull: false,
            type: Sequelize.UUID,
            references: {
                model: 'degrees',
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
    }, {

    });

    Doctor.associate = function (models) {
        Doctor.belongsTo(models.user, { foreignKey: 'user_id' });
    };
    Doctor.associate = function (models) {
        Doctor.belongsTo(models.workplace, { foreignKey: 'id_workplace' });
    };
    Doctor.associate = function (models) {
        Doctor.belongsTo(models.degree, { foreignKey: 'id_degree' });
    };

    return Doctor;
};
