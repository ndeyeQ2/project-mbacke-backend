const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Classe = sequelize.define('Classe', {
    idClasse: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nomClasse: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'CLASSE',
    timestamps: false,
});

module.exports = Classe ;