const express = require('express');
const router = express.Router();
const classeController = require('../controllers/classeController');

// Route pour créer une classe
router.post('/create', classeController.createClasse);

// Route pour récupérer toutes les classes
router.get('/get', classeController.getClasses);

// Route pour récupérer une classe par son ID
router.get('/:idClasse', classeController.getClasseById);

// Route pour mettre à jour une classe
router.put('/update/:idClasse', classeController.updateClasse);

// Route pour supprimer une classe
router.delete('/delete/:idClasse', classeController.deleteClasse);

module.exports = router;
