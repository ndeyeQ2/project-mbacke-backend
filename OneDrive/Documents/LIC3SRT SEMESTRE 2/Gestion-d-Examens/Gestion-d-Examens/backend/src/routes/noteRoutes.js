const express = require('express');
const noteController = require('../controllers/noteController');
const router = express.Router();

// Créer une nouvelle note
router.post('/create', noteController.createNote);

// Obtenir toutes les notes
router.get('/', noteController.getAllNotes);

// Obtenir une note par ID
router.get('/:id', noteController.getNoteById);

// Mettre à jour une note
router.put('/:id', noteController.updateNote);

// Supprimer une note
router.delete('/:id', noteController.deleteNote);

module.exports = router;
