const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota POST para cadastro de usuário
router.post('/register', userController.register);

module.exports = router;
