const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./src/config/sequelize');

// Charger les variables d'environnement
dotenv.config();

// Initialiser Express
const app = express();
const PORT = process.env.PORT || 5000;

// Créer un serveur HTTP
const server = http.createServer(app);

// Initialiser Socket.IO avec le serveur HTTP
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5174', // Adresse de votre front-end
        credentials: true,              // Autoriser les cookies
    },
});

// Gestion des événements WebSocket
io.on('connection', (socket) => {
    console.log('Un client s\'est connecté :', socket.id);

    // Écouter les événements personnalisés (optionnel)
    socket.on('custom-event', (data) => {
        console.log('Événement personnalisé reçu :', data);
    });

    // Gérer la déconnexion
    socket.on('disconnect', () => {
        console.log('Un client s\'est déconnecté :', socket.id);
    });
});

// Middleware pour parser le JSON
app.use(express.json());

// Middleware CORS
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true,
}));

// Importer et configurer les routes
const classeRoutes = require('./src/routes/classeRoutes');
const statistiqueRoutes = require('./src/routes/statistiqueRoutes');
const matiereRoutes = require('./src/routes/matiereRoutes');
const enseignantRoutes = require('./src/routes/enseignantRoutes');
const etudiantRoutes = require('./src/routes/etudiantRoutes');
const examRoutes = require('./src/routes/examRoutes');
const copyRoutes = require('./src/routes/copyRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const plagiatRoutes = require('./src/routes/plagiatRoutes');
const correctionRoutes = require('./src/routes/correctionRoutes');
const chatbotRoutes = require('./src/routes/chatbotRoutes');
const commentaireRoutes = require('./src/routes/commentaireRoutes');
const exameCommentaireRoutes = require('./src/routes/examCommentairesRoutes');
const examCopyEtudiantRoutes = require('./src/routes/examCopyEtudiantRoutes');
const authMiddleware = require('./src/middleware/auth');

// Ajouter les routes avec les middlewares appropriés
app.use('/api/enseignants', enseignantRoutes);
app.use('/api/etudiants', etudiantRoutes);
app.use('/api/exams', authMiddleware, examRoutes(io)); // Passer `io` à `examRoutes`
app.use('/api/copies', authMiddleware, copyRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/plagiat', authMiddleware, plagiatRoutes);
app.use('/api/corrections', authMiddleware, correctionRoutes);
app.use('/api/matiere', matiereRoutes);
app.use('/api/classe', classeRoutes);
app.use('/api/statistique', authMiddleware, statistiqueRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/api/commentaire', authMiddleware, commentaireRoutes);
app.use('/api/examCommentaire', authMiddleware, exameCommentaireRoutes);
app.use('/api/examCopyEtudiant',authMiddleware, examCopyEtudiantRoutes);

// Tester la connexion à la base de données
sequelize.authenticate()
    .then(() => {
        console.log('Connection to BD has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

// Synchroniser les modèles avec la base de données
sequelize.sync()
    .then(() => {
        console.log('Models synchronized with the database.');
    })
    .catch((err) => {
        console.error('Unable to synchronize models:', err);
    });

// Démarrer le serveur HTTP
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
