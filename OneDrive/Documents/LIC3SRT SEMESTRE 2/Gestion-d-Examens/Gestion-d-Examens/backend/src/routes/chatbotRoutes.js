const express = require('express');
const chatbotController = require('../controllers/chatbotController');
const router = express.Router();

// Endpoint pour discuter avec le chatbot
router.post('/chat', chatbotController.chatWithBot);

module.exports = router;
