const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const auth = require('../middleware/auth');
const upload = require('../config/multer');

// Middleware pour ajouter io à req
const addIoToRequest = (io) => (req, res, next) => {
    req.io = io;
    next();
};

// Exporter une fonction qui prend `io` comme paramètre
module.exports = (io) => {
    // Créer un examen
    router.post('/create', auth, addIoToRequest(io), upload.single('sujet'), examController.createExam);

    // Obtenir tous les examens d'un enseignant
    router.get('/get', auth, examController.getExamsByTeacher);

    // Supprimer un examen
    router.delete('/delete/:id', auth, examController.deleteExam);

    return router; // Retourner le routeur configuré
};
