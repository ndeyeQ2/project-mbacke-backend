const express = require('express');
const etudiantController = require('../controllers/etudiantController');

const router = express.Router();

// Inscription (POST /api/etudiants/register)
router.post('/register', etudiantController.register);

// Connexion (POST /api/etudiants/login)
router.post('/login', etudiantController.login);

// Obtenir les informations d'un étudiant par ID (GET /api/etudiants/:id)
router.get('/:id', etudiantController.getEtudiant);

// Obtenir les informations d'un étudiant et examens par ID (GET /api/etudiants/:id)
router.get('/data/:id', etudiantController.getEtudiantData);

// Mise à jour des informations d'un étudiant
router.put('/update/:id', etudiantController.updateEtudiant);

module.exports = router;
