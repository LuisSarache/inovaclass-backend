const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

// Registrar novo usuário
const register = (req, res) => {
  const { cpf, password, tipo } = req.body;

  if (!cpf || !password || !tipo) {
    return res.status(400).json({ message: 'Preencha CPF, senha e tipo de usuário' });
  }

  userModel.findUserByCpf(cpf, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor ao buscar CPF' });

    if (results.length > 0) {
      return res.status(400).json({ message: 'Usuário já registrado com este CPF' });
    }

    // Mover o async para fora do callback
    bcrypt.hash(password, 10)
      .then((hashedPassword) => {
        userModel.createUser({ cpf, password: hashedPassword, tipo }, (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Erro ao registrar usuário' });
          }
          res.status(201).json({ message: 'Usuário registrado com sucesso!' });
        });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Erro ao criptografar senha' });
      });
  });
};

// Login de usuário
const login = (req, res) => {
  const { cpf, password } = req.body;

  if (!cpf || !password) {
    return res.status(400).json({ message: 'Preencha CPF e senha' });
  }

  userModel.findUserByCpf(cpf, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor ao buscar usuário' });

    if (results.length === 0) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password)
      .then((match) => {
        if (!match) {
          return res.status(400).json({ message: 'Senha incorreta' });
        }
        res.status(200).json({ message: 'Login realizado com sucesso!' });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Erro ao verificar senha' });
      });
  });
};

// Logout de usuário
const logout = (req, res) => {
  res.status(200).json({ message: 'Logout realizado com sucesso!' });
};

module.exports = { register, login, logout };
