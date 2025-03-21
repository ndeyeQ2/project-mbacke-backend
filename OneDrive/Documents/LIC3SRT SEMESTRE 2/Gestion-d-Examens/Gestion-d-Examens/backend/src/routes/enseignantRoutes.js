const express = require('express');
const enseignantController = require('../controllers/enseignantController'); // Correctement importé

const router = express.Router();

// Inscription (POST /api/enseignants/register)
router.post('/register', enseignantController.register);

// Connexion (POST /api/enseignants/login)
router.post('/login', enseignantController.login);

// Obtenir les informations d'un enseignant (GET /api/enseignants/:id)
router.get('/:id', enseignantController.getEnseignant);

// Mise à jour des informations d'un enseignant
router.put('/update/:id', enseignantController.updateEnseignant);



module.exports = router;
