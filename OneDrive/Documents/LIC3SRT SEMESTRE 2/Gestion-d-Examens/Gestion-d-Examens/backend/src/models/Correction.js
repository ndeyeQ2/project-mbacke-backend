const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Correction = sequelize.define('Correction', {
    idCorrection: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idCopie: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Copy',
            key: 'idCopie',
        },
        onDelete: 'CASCADE',
    },
    noteIa: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false, 
        validate: {
            min: 0, 
            max: 20, 
        },
    },
    noteProf: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
            min: 0,
            max: 20,
        },
    },
}, {
    tableName: 'CORRECTION',
    timestamps: false,
});

module.exports = Correction;