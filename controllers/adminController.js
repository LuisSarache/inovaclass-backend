const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models"); // use o index.js para exportar todos os models

// Login do administrador
exports.loginAdmin = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação inicial
    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    // Busca pelo admin no banco
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Verifica a senha com bcrypt
    const senhaValida = await bcrypt.compare(senha, admin.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      message: "Login realizado com sucesso",
      token,
      admin: {
        id: admin.id,
        nome: admin.nome,
        email: admin.email
      }
    });
  } catch (error) {
    console.error("Erro no login do admin:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
