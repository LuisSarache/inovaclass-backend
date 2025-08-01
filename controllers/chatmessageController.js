require('dotenv').config();
const { OpenAI } = require('openai');
const ChatMessage = require('../models/chatmessageModel');

if (!process.env.HF_API_TOKEN) {
  throw new Error("Variável HF_API_TOKEN não está definida. Verifique seu .env.");
}

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_API_TOKEN,
});

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.session ? req.session.userId : null;

    if (!message) {
      return res.status(400).json({ message: 'Mensagem é obrigatória.' });
    }

    const chatCompletion = await client.chat.completions.create({
      model: "zai-org/GLM-4.5:novita",
      messages: [{ role: "user", content: message }],
    });

    const reply = chatCompletion.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ message: 'Resposta inválida da API de chat.' });
    }

    await ChatMessage.create({ userId, message, reply });

    return res.json({ reply });
  } catch (error) {
    console.error("Erro na API de chat:", error.response?.data || error.message);
    return res.status(500).json({
      error: "Erro ao processar a solicitação de chat.",
      details: error.message,
    });
  }
};
