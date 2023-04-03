'use strict';

const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Patient = sequelize.define('patient', {
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
            allowNull: false,
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
            allowNull: false,
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
    }, {

    });

    Patient.associate = function (models) {
        Patient.belongsTo(models.user, { foreignKey: 'user_id', onDelete: 'CASCADE' });
        Patient.belongsTo(models.bloodGroup, { foreignKey: 'id_blood_groups' });
    };

    return Patient;
};
