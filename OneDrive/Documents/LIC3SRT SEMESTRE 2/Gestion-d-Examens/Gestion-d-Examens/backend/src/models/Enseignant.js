const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Enseignant = sequelize.define('Enseignant', {
    idEnseignant: {
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
    idMatiere: {
        type: DataTypes.CHAR(9),
        allowNull: false,
        references: {
            model: 'Matiere',
            key: 'idMatiere',
        },
        onDelete: 'SET NULL',
    },
}, {
    tableName: 'ENSEIGNANT',
    timestamps: false,
});

module.exports = Enseignant;