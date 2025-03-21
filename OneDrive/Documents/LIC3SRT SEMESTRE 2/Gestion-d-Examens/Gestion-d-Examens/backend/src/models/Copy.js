const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Copy = sequelize.define('Copy', {
    idCopie: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fichier: {
        type: DataTypes.STRING(5000),
        allowNull: false,
    },
    dateDeSoumission: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    note: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    commentaire: {
        type: DataTypes.STRING(1000),
        allowNull: true,
    },
    idExamen: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Exam',
            key: 'idExamen',
        },
        onDelete: 'CASCADE', 
    },
    idEtudiant: {
        type: DataTypes.CHAR(9), 
        references: {
            model: 'Etudiant', 
            key: 'idEtudiant', 
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'COPIE',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['idExamen', 'idEtudiant'],
        },
    ],
});

module.exports = Copy;