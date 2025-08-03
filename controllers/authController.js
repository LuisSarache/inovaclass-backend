const bcrypt = require('bcrypt');
const { createUser, findUserByCpf } = require('../models/userModel');

// Registro de usuário
const register = async (req, res) => {
  const { cpf, password, tipo } = req.body;

  if (!cpf || !password || !tipo) {
    return res.status(400).json({ message: 'Preencha CPF, senha e tipo de usuário.' });
  }

  try {
    const existing = await findUserByCpf(cpf);
    if (existing.length > 0) {
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
    return res.status(400).json({ message: 'Preencha CPF.' });
  }

  try {
    const users = await findUserByCpf(cpf);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const user = users[0];
    

    // Se desejar gerar JWT, coloque aqui.
    return res.status(200).json({
      message: 'Login realizado com sucesso!',
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
