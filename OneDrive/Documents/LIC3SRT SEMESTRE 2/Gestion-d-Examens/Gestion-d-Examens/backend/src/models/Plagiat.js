const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Plagiat = sequelize.define('Plagiat', {
    idPlagiat: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idCopie1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Copy',
            key: 'idCopie',
        },
        onDelete: 'CASCADE',
    },
    idCopie2: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Copy',
            key: 'idCopie',
        },
        onDelete: 'CASCADE',
    },
    tauxSimilarite: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 100,
        },
    },
}, {
    tableName: 'PLAGIAT',
    timestamps: false, 
});

module.exports = Plagiat;