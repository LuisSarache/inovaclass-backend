require('dotenv').config();
const axios = require('axios');
const { ChatMessage } = require('../models/chatmessageModel');

if (!process.env.HF_API_TOKEN) {
  throw new Error("Variável HF_API_TOKEN não está definida. Verifique seu .env.");
}

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Banco atualizado com sucesso!");
    // aí você inicia seu servidor depois
  } catch (error) {
    console.error("Erro ao atualizar banco:", error);
  }
})();

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.session ? req.session.userId : null;

    if (!message) {
      return res.status(400).json({ message: 'Mensagem é obrigatória.' });
    }

    // Faz a requisição POST para a API Hugging Face
    const response = await axios.post(
      'https://router.huggingface.co/v1/chat/completions',
      {
        model: "zai-org/GLM-4.5:novita",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // opcional: timeout de 30s
      }
    );

    // Extrai a resposta do modelo
    const reply = response.data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ message: 'Resposta inválida da API de chat.' });
    }

    // Salva no banco
    await ChatMessage.create({
      remetente_id: userId || 1,
      destinatario_id: 0,
      conteudo: message,
      resposta: reply,
    });

    return res.json({ reply });
  } catch (error) {
    console.error("Erro na API de chat:", error.response?.data || error.message);
    return res.status(500).json({
      error: "Erro ao processar a solicitação de chat.",
      details: error.message,
    });
  }
};
