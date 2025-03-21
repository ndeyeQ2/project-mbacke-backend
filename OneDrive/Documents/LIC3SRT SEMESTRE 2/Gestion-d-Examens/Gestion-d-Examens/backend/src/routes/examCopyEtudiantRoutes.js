const examCopyEtudiantController = require('../controllers/examCopyEtudiantController');
const express = require('express');
const router = express.Router();

router.get('/:id', examCopyEtudiantController.getCopiesEtudiantByExam);

module.exports = router;