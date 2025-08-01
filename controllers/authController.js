const bcrypt = require('bcrypt');
const { createUser, findUserByCpf } = require('../models/userModel');

const register = (req, res) => {
  const { cpf, password, tipo } = req.body;

  if (!cpf || !password || !tipo) {
    return res.status(400).json({ message: 'Preencha CPF, senha e tipo de usuário' });
  }

  findUserByCpf(cpf, async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no servidor ao buscar CPF', error: err.message });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Usuário já registrado com este CPF' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      createUser({ cpf, password: hashedPassword, tipo }, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao registrar usuário', error: err.message });
        }
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
      });
    } catch (hashErr) {
      res.status(500).json({ message: 'Erro ao criptografar senha', error: hashErr.message });
    }
  });
};

const login = (req, res) => {
  const { cpf, password } = req.body;

  if (!cpf || !password) {
    return res.status(400).json({ message: 'Preencha CPF e senha' });
  }

  findUserByCpf(cpf, async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no servidor ao buscar usuário', error: err.message });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    res.status(200).json({ message: 'Login realizado com sucesso!' });
  });
};

const logout = (req, res) => {
  // Se estiver usando sessões:
  if (req.session) {
    req.session.destroy(() => {
      res.status(200).json({ message: 'Logout realizado com sucesso!' });
    });
  } else {
    res.status(200).json({ message: 'Logout realizado com sucesso!' });
  }
};

module.exports = { register, login, logout };
