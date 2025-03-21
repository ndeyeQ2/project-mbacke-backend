const examCommentsController = require('../controllers/examCommentairesController');

const express = require('express');

const router = express.Router();

router.get('/get/:id', examCommentsController.getCommentByIdExam);

module.exports = router;