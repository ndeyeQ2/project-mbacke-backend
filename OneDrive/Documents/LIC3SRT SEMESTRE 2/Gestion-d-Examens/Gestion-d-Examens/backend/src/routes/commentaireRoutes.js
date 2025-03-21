const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentaireController');

// Créer un commentaire
router.post('/create', commentController.createComment);

// Récupérer tous les commentaires
router.get('/get', commentController.getAllComments);

// Récupérer un commentaire par son ID
router.get('/get/:id', commentController.getCommentById);

// Mettre à jour un commentaire
router.put('/update/:id', commentController.updateComment);

// Supprimer un commentaire
router.delete('/delete/:id', commentController.deleteComment);

module.exports = router;