// routes/chat.js
const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// Buscar mensagens
router.get('/', async (req, res) => {
  try {
    const mensagens = await Message.findAll({ order: [['createdAt', 'ASC']] });
    res.json(mensagens);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

// Salvar nova mensagem
router.post('/', async (req, res) => {
  const { autor, texto } = req.body;
  if (!autor || !texto) return res.status(400).json({ error: 'Campos obrigatórios' });

  try {
    const novaMsg = await Message.create({ autor, texto });
    res.status(201).json(novaMsg);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar mensagem' });
  }
});

module.exports = router;
