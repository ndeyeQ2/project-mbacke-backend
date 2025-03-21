const express = require('express');
const matiereController = require('../controllers/matiereController');
const router = express.Router();

// Créer une nouvelle matière
router.post('/create', matiereController.createMatiere);

// Obtenir toutes les matières
router.get('/get', matiereController.getAllMatieres);

// Obtenir une matière par ID
router.get('/:id', matiereController.getMatiereById);

// Mettre à jour une matière
router.put('/:id', matiereController.updateMatiere);

// Supprimer une matière
router.delete('/:id', matiereController.deleteMatiere);

module.exports = router;
