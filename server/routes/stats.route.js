const express = require('express');
const authorize = require('../middlewares/auth');
const statsController = require('../controllers/stats.controller');
const router = express.Router();

router.get('/totalChatbotUsers', authorize(), statsController.totalChatbotUsers);
router.get('/eventChatbotUsers', authorize(), statsController.eventChatbotUsers);
router.get('/usageChatbot', authorize(), statsController.usageChatbot);

module.exports = router;