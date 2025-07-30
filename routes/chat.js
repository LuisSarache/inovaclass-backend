const express = require('express');
const router = express.Router();
const autenticarSessao = require('../middlewares/autenticarSessao');
const chatMessageController = require('../controllers/chatmessageController');

router.post('/chat', autenticarSessao, chatMessageController.sendMessage);

module.exports = router;
