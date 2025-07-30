const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const register = (req, res) => {
  const { cpf, password, nome, tipo } = req.body;

  if (!cpf || !password || !nome || !tipo) {
    return res.status(400).json({ message: 'Preencha todos os campos' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao criptografar a senha' });
    }

    userModel.createUser(cpf, nome, tipo, hash, (err, result) => {
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

  userModel.findUserByCpf(cpf, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'CPF não encontrado' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Erro ao verificar senha' });

      if (!isMatch) return res.status(401).json({ message: 'Senha incorreta' });

      // Salva dados na sessão
      req.session.userId = user.id;
      req.session.cpf = user.cpf;
      req.session.tipo = user.tipo;

      res.status(200).json({ message: 'Login efetuado com sucesso!', userId: user.id });
    });
  });
};

const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao deslogar' });
    }
    res.json({ message: 'Logout realizado com sucesso' });
  });
};

module.exports = { register, login, logout };
