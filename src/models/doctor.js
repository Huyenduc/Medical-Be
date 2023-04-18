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
            type: Sequelize.STRING,
        },
        license_number: {
            unique: true,
            type: Sequelize.STRING
        },
        about: {
            type: Sequelize.STRING
        },
        exp: {
            type: Sequelize.INTEGER
        },
        rating: {
            type: Sequelize.INTEGER
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
        id_workplace: {
            type: Sequelize.UUID,
            references: {
                model: 'workplaces',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        id_degree: {
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
        Doctor.belongsTo(models.user, { foreignKey: 'user_id', onDelete: 'CASCADE' });
        Doctor.belongsTo(models.workplace, { foreignKey: 'id_workplace' });
        Doctor.belongsTo(models.degree, { foreignKey: 'id_degree' });
    };

    return Doctor;
};
