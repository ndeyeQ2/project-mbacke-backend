const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Etudiant = sequelize.define('Etudiant', {
    idEtudiant: {
        type: DataTypes.CHAR(9),
        primaryKey: true,
    },
    nom: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    prenom: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    motDePasse: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    idClasse: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Classe',
            key: 'idClasse',
        },
        onDelete: 'SET NULL',
    },
}, {
    tableName: 'ETUDIANT',
    timestamps: false,
});

module.exports = Etudiant;