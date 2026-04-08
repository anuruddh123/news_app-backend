// Notifications Routes
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

// All notification routes require authentication
router.use(authMiddleware);

router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.get('/category/:category', notificationController.getNotificationsByCategory);
router.get('/dashboard', notificationController.getDashboardData);
router.put('/:id/read', notificationController.markAsRead);
router.put('/mark-all-as-read', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
