const express = require("express");
const { InferenceClient } = require("@huggingface/inference");
require("dotenv").config();

const router = express.Router();
const client = new InferenceClient(process.env.HF_TOKEN);

router.post("/ia", async (req, res) => {
  const mensagem = req.body.mensagem;

  try {
    const resposta = await client.chatCompletion({
      provider: "novita",
      model: "zai-org/GLM-4.5",
      messages: [{ role: "user", content: mensagem }],
    });

    res.json(resposta.choices?.[0]?.message?.content ?? "Sem resposta");
  } catch (error) {
    console.error("Erro na IA:", error);
    res.status(500).json({ erro: "Falha ao processar com a IA" });
  }
});

module.exports = router;
