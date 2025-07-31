const express = require('express');
const router = express.Router();
const chatMessageController = require('../controllers/chatmessageController');

router.post('/chat', chatMessageController.sendMessage);

module.exports = router;
