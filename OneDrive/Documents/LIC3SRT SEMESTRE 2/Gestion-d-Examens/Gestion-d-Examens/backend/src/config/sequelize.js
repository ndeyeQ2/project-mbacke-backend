require('dotenv').config(); // Charger les variables d'environnement
const { Sequelize } = require('sequelize');

// Configuration de la connexion à la base de données
const sequelize = new Sequelize(
    process.env.DB_NAME,           // Nom de la base de données
    process.env.DB_USER,           // Utilisateur de la base de données
    process.env.DB_PASSWORD,       // Mot de passe de la base de données
    {
        host: process.env.DB_HOST, // Hôte de la base de données
        port: process.env.DB_PORT, // Port de la base de données
        logging: console.log ,// Active les logs SQL
        dialect: 'mariadb',          // Dialecte de la base de données (MariaDB)
        logging: false,            // Désactiver les logs SQL (optionnel)
        pool: {
            max: 10,               // Nombre maximum de connexions dans le pool
            min: 0,                // Nombre minimum de connexions dans le pool
            acquire: 30000,        // Temps maximum (en ms) pour acquérir une connexion
            idle: 10000            // Temps maximum (en ms) pendant lequel une connexion peut être inactive
        }
    }
);

// Tester la connexion à la base de données
sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

module.exports = sequelize;
