const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); 
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// ROTA DE TESTE
router.get('/teste', (req, res) => {
  res.send('Rota /api/auth/teste funcionando!');
});

module.exports = router;
