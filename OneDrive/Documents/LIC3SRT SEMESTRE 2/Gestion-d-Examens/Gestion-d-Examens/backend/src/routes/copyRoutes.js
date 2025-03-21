// routes/copyRoutes.js
const express = require('express');
const router = express.Router();
const copyController = require('../controllers/copyController');
const auth = require('../middleware/auth');
const upload = require('../config/multer'); // Importer la configuration multer

// Soumettre une copie (POST /api/copies)
router.post('/submit', auth, upload.single('fichier'), copyController.submitCopy);

// Obtenir toutes les copies d'un examen (GET /api/copies/exam/:id)
router.get('/exam/:id', auth, copyController.getCopiesByExam);

// Supprimer une copie (DELETE /api/copies/:id)
router.delete('/delete/:id', auth, copyController.deleteCopy);

module.exports = router;
