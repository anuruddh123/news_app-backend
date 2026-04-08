// Alerts Routes
const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authMiddleware = require('../middleware/auth');

// All alert routes require authentication
router.use(authMiddleware);

router.post('/', alertController.createAlert);
router.get('/', alertController.getAlerts);
router.get('/active', alertController.getUserActiveAlerts);
router.get('/:id', alertController.getAlertById);
router.put('/:id', alertController.updateAlert);
router.delete('/:id', alertController.deleteAlert);
router.patch('/:id/toggle', alertController.toggleAlert);

module.exports = router;
