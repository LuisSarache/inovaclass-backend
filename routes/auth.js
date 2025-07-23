const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota POST para login
router.post('/login', userController.login);

module.exports = router;
