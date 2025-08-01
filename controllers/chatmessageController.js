require('dotenv').config();
const { OpenAI } = require('openai');
const ChatMessage = require('../models/chatmessageModel');

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.OPENAI_API_KEY,  // ajuste a variável de ambiente conforme seu .env
});

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.session ? req.session.userId : null; // cuidado se não tiver sessão

    if (!message) {
      return res.status(400).json({ message: 'Mensagem é obrigatória.' });
    }

    // Faz a chamada para o modelo via SDK OpenAI configurado para Hugging Face
    const chatCompletion = await client.chat.completions.create({
      model: "zai-org/GLM-4.5:novita",
      messages: [
        { role: "user", content: message },
      ],
    });

    // Extrai a resposta
    const reply = chatCompletion.choices[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ message: 'Resposta inválida da API de chat.' });
    }

    // Salva a mensagem no banco, se estiver usando banco
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
