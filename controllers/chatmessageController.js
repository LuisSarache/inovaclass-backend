// controllers/chatmessageController.js

const fetch = require('node-fetch');
const ChatMessage = require('../models/chatmessageModel');

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.session ? req.session.userId : null; // cuidado caso não tenha sessão

    if (!message) {
      return res.status(400).json({ message: 'Mensagem é obrigatória.' });
    }

    // Faz a chamada pra API externa
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.HF_API_TOKEN}`,  // ajuste sua variável de ambiente
      },
      body: JSON.stringify({
        model: "moonshotai/Kimi-K2-Instruct",
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro da API externa: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Ajuste aqui para extrair a resposta de acordo com o formato da API
    const reply = data.generated_text || (Array.isArray(data) && data[0]?.generated_text);

    if (!reply) {
      return res.status(500).json({ message: 'Resposta inválida da API de chat.' });
    }

    // Salva no banco, se usar banco
    await ChatMessage.create({
      userId,
      message,
      reply,
    });

    return res.json({ reply });
  } catch (error) {
    console.error("Erro na API de chat:", error);
    return res.status(500).json({ error: error.message || "Erro ao processar a solicitação de chat." });
  }
};
