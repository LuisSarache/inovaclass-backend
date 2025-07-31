const fetch = require('node-fetch');
const ChatMessage = require('../models/chatmessageModel');

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.session.userId;

    if (!message) {
      return res.status(400).json({ message: 'Mensagem é obrigatória.' });
    }

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.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}`,
      },
      body: JSON.stringify({
        model: "moonshotai/Kimi-K2-Instruct",
        messages: [
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ message: 'Resposta inválida da API de chat.' });
    }

    const reply = data.choices[0].message.content;

    await ChatMessage.create({
      userId,
      message,
      reply,
    });

    res.json({ reply });
  } catch (error) {
    console.error("Erro na API de chat:", error);
    res.status(500).json({ error: "Erro ao processar a solicitação de chat." });
  }
};
