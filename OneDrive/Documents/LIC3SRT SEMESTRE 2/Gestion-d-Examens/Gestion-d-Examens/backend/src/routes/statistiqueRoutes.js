const express = require('express');
const router = express.Router();
const statistiqueController = require('../controllers/statistiqueController');

// router.get('/examen/calcul/:idExamen', statistiqueController.calculateExamStatistic);

// Récupérer toutes les statistiques
router.get('/recup', statistiqueController.getAllStatistiques);

// Récupérer les statistiques d'un examen par son ID
router.get('/examen/:idExamen', statistiqueController.getStatistiqueByExamenId);


module.exports = router;