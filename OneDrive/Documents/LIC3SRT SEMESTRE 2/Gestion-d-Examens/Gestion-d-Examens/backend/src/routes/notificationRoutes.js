const express = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Obtenir toutes les notifications d'un utilisateur (GET /api/notifications/user/:id)
router.get('/get/:id', authMiddleware, notificationController.getNotificationsByUser);
router.delete('/notification/:id', authMiddleware, notificationController.delete);
router.delete('user/:id', authMiddleware, notificationController.deleteAll);

module.exports = router;