// routes/questions.js
const express = require('express');
const router = express.Router();
const Question = require('../models/question');

router.post('/', async (req, res) => {
  const { texto } = req.body;
  if (!texto) return res.status(400).json({ error: "Texto da pergunta obrigatório" });

  try {
    const novaPergunta = await Question.create({ texto });
    res.status(201).json(novaPergunta);
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar pergunta" });
  }
});

module.exports = router;
