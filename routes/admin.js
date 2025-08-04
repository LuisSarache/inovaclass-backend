const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Corrigindo importação: use o index.js que exporta todos os models
const { Admin, Professor, Aluno, Turma } = require("../models/admin");

const router = express.Router();

// Middleware para validar token do admin
const autenticarAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ error: "Token mal formatado" });
  }

  const token = parts[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.adminId = decoded.id;
    next();
  });
};

// ✅ Login Admin
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ error: "Admin não encontrado" });
    }

    const match = await bcrypt.compare(senha, admin.senha);
    if (!match) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Erro no login admin:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// ✅ Cadastrar professor
router.post("/professor", autenticarAdmin, async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const hash = await bcrypt.hash(senha, 10);
    const professor = await Professor.create({ nome, email, senha: hash });

    res.status(201).json(professor);
  } catch (error) {
    console.error("Erro ao cadastrar professor:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// ✅ Cadastrar aluno
router.post("/aluno", autenticarAdmin, async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const hash = await bcrypt.hash(senha, 10);
    const aluno = await Aluno.create({ nome, email, senha: hash });

    res.status(201).json(aluno);
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// ✅ Criar turma
router.post("/turma", autenticarAdmin, async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    if (!nome) {
      return res.status(400).json({ error: "Nome da turma é obrigatório" });
    }

    const turma = await Turma.create({ nome, descricao });
    res.status(201).json(turma);
  } catch (error) {
    console.error("Erro ao criar turma:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// ✅ Atribuir professor à turma
router.post("/turma/:id/professor", autenticarAdmin, async (req, res) => {
  try {
    const turma = await Turma.findByPk(req.params.id);
    if (!turma) return res.status(404).json({ error: "Turma não encontrada" });

    const professor = await Professor.findByPk(req.body.professorId);
    if (!professor) return res.status(404).json({ error: "Professor não encontrado" });

    if (!turma.addProfessor) {
      return res.status(400).json({ error: "Associação entre Turma e Professor não configurada" });
    }

    await turma.addProfessor(professor);

    res.json({ message: "Professor atribuído à turma com sucesso" });
  } catch (error) {
    console.error("Erro ao atribuir professor:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

module.exports = router;
