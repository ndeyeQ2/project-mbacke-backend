const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Importez votre instance Sequelize
const Exam = require('./Exam');

const Statistique = sequelize.define('Statistique', {
    idStatistique: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    moyenne: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        allowNull: false
    },
    tauxReussite: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        allowNull: false
    },
    idExamen: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'EXAMEN', // Nom de la table EXAMEN
            key: 'idExamen'
        }
    }
}, {
    tableName: 'STATISTIQUES', // Nom de la table dans la base de données
    timestamps: false // Désactive les colonnes createdAt et updatedAt
});

Statistique.belongsTo(Exam, {
    foreignKey: 'idExamen',
    as: 'exam'
});


module.exports = Statistique;