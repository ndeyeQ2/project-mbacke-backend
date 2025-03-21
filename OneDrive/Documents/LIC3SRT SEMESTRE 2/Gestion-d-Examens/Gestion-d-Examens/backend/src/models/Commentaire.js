const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // Importez votre instance Sequelize

const Comment = sequelize.define('Comment', {
    idCommentaire: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    contenu: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    idEtudiant: {
        type: DataTypes.CHAR(9),
        allowNull: true, // Peut être NULL
        references: {
            model: 'Etudiant', // Nom de la table ETUDIANT
            key: 'idEtudiant'
        }
    },
    idEnseignant: {
        type: DataTypes.CHAR(9),
        allowNull: true, // Peut être NULL
        references: {
            model: 'Enseignant', // Nom de la table ENSEIGNANT
            key: 'idEnseignant'
        }
    },
    idExamen: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Exam', // Nom de la table EXAMEN
            key: 'idExamen'
        }
    },
    dateModification: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // Valeur par défaut : date actuelle
    }
}, {
    tableName: 'COMMENTAIRE', // Nom de la table dans la base de données
    timestamps: false,
});

module.exports = Comment;