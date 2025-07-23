const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const register = (req, res) => {
  const { cpf, password } = req.body;

  if (!cpf || !password) {
    return res.status(400).json({ message: 'Preencha CPF e senha' });
  }

  // Criptografa a senha antes de salvar
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao criptografar a senha' });
    }

    // Tenta criar o usuário no banco
    userModel.createUser(cpf, hash, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'CPF já cadastrado' });
        }
        return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
      }

      res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    });
  });
};

const login = (req, res) => {
  const { cpf, password } = req.body;

  if (!cpf || !password) {
    return res.status(400).json({ message: 'Preencha CPF e senha' });
  }

  // Busca usuário pelo CPF no banco
  userModel.findUserByCpf(cpf, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'CPF não encontrado' });
    }

    const user = results[0];

    // Compara a senha enviada com o hash do banco
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao verificar senha' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Senha incorreta' });
      }

      // Login bem-sucedido
      res.status(200).json({ message: 'Login efetuado com sucesso!', userId: user.id });
    });
  });
};

module.exports = {
  register,
  login,
};
