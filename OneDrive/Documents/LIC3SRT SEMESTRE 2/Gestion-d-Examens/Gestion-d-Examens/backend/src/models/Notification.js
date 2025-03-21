const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Notification = sequelize.define('Notification', {
    idNotification: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    message: {
        type: DataTypes.STRING(5000),
        allowNull: false,
    },
    dateEtHeure: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    idEtudiant: {
        type: DataTypes.CHAR(9),
        allowNull: true,
        references: {
            model: 'Etudiant',
            key: 'idEtudiant',
        },
        onDelete: 'CASCADE',
    },
    idExam: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Exam',
            key: 'idExam',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'NOTIF',
    timestamps: false,
});

module.exports = Notification;