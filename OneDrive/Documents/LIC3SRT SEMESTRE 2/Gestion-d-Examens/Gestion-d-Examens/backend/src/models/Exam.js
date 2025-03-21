const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Statistique = require('./Statistique'); // Importer le modèle Enseignant

const Exam = sequelize.define('Exam', {
    idExamen: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    sujet: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    dateDeCreation: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    dateLimite: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isAfterCreationDate(value) {
                if (value <= this.dateDeCreation) {
                    throw new Error('La date limite doit être postérieure à la date de création.');
                }
            },
        },
    },
    idEnseignant: {
        type: DataTypes.CHAR(9),
        references: {
            model: 'Enseignant', // Si vous avez une table Enseignant
            key: 'idEnseignant',
        },
        onDelete: 'CASCADE',
    },
    idMatiere: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Matiere', // Si vous avez une table Matiere
            key: 'idMatiere',
        },
        onDelete: 'SET NULL',
    },
}, {
    tableName: 'EXAMEN',
    timestamps: false,
});

Exam.associate = (models) => {
    // Chaque examen appartient à un enseignant.
    Exam.belongsTo(models.Enseignant, { foreignKey: 'idEnseignant' });
    Exam.belongsTo(models.Matiere, { foreignKey: 'idMatiere' });
};



module.exports = Exam;
