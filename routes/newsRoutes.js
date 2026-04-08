// News Routes
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middleware/auth');

router.get('/', newsController.getNews);
router.get('/breaking', newsController.getBreakingNews);
router.get('/search', newsController.searchNews);
router.get('/category/:category', newsController.getCategoryNews);
router.get('/stats', newsController.getNewsStats);
router.get('/:id', newsController.getNewsById);
router.post('/:id/share', authMiddleware, newsController.shareNews);
router.post('/fetch-and-save', newsController.fetchAndSaveNews);

module.exports = router;
