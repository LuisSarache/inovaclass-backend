const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { cpf } = req.body;

  if (!cpf) return res.status(400).json({ message: 'CPF é obrigatório.' });

  try {
    const user = await User.findOne({ cpf });

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    // Gera token JWT
    const token = jwt.sign(
      { id: user._id, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Erro no login', error: err.message });
  }
};

module.exports = { login };
