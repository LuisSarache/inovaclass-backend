const fetch = require('node-fetch');
const ChatMessage = require('../models/chatmessageModel');

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.session?.userId || null;

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
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro na API Hugging Face:", response.status, errorText);
      return res.status(500).json({ message: 'Erro ao chamar API de chat externa.' });
    }

    const data = await response.json();
    console.log('Resposta da API Hugging Face:', data);

    const reply = data.choices?.[0]?.message?.content || data.generated_text;

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
    console.error("Erro na API de chat:", error.message);
    console.error(error.stack);
    res.status(500).json({ error: "Erro ao processar a solicitação de chat." });
  }
};
