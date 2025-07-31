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
    console.log('Resposta da API:', data);

    // Ajuste aqui para pegar o reply conforme a estrutura do Hugging Face
    const reply = data.generated_text || (Array.isArray(data) && data[0]?.generated_text);

    if (!reply) {
      return res.status(500).json({ message: 'Resposta inválida da API de chat.' });
    }

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
