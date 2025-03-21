const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Matiere = sequelize.define('Matiere', {
    idMatiere: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nom: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },

}, {
    tableName: 'MATIERE',
    timestamps: false,
});

module.exports = Matiere;
