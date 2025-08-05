const bcrypt = require('bcrypt');
const { createUser, findUserByCpf } = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Registro de usuário
const register = async (req, res) => {
  const { cpf, password, tipo } = req.body;

  if (!cpf || !password || !tipo) {
    return res.status(400).json({ message: 'Preencha CPF, senha e tipo de usuário.' });
  }

  try {
    const existing = await findUserByCpf(cpf);
    if (existing) {
      return res.status(400).json({ message: 'Usuário já registrado com este CPF.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({ cpf, password: hashedPassword, tipo });

    return res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ message: 'Erro ao registrar usuário.', error: error.message });
  }
};

// Login de usuário
const login = async (req, res) => {
  const { cpf, password } = req.body;

  if (!cpf) {
    return res.status(400).json({ message: 'Preencha CPF corretamente' });
  }

  try {
    const user = await findUserByCpf(cpf);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }


    // Gera token JWT
    const token = jwt.sign(
      { id: user.id, tipo: user.tipo },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      userId: user.id,
      tipo: user.tipo
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro no servidor.', error: error.message });
  }
};

// Logout simples (sessão)
const logout = (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      return res.status(200).json({ message: 'Logout realizado com sucesso!' });
    });
  } else {
    return res.status(200).json({ message: 'Logout realizado com sucesso!' });
  }
};

module.exports = { register, login, logout };
