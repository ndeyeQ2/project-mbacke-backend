const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Note = sequelize.define('Note', {
    idNote: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    note: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
            min: 0,
            max: 20
        }
    },
    source: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            isIn: [['IA', 'Prof']]
        }
    }
}, {
    tableName: 'NOTES',
    timestamps: false
});

module.exports = Note;
