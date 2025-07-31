const userModel = require('../models/userModel');

// Login (usando apenas CPF)
const login = (req, res) => {
  const { cpf } = req.body;

  if (!cpf) {
    return res.status(400).json({ message: 'Preencha o CPF' });
  }

  userModel.findUserByCpf(cpf, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'CPF não encontrado' });
    }

    const user = results[0];

    // Salva dados na sessão
    req.session.userId = user.id;
    req.session.cpf = user.cpf;
    req.session.tipo = user.tipo;

    res.status(200).json({ message: 'Login efetuado com sucesso!', userId: user.id });
  });
};

// Logout
const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao deslogar' });
    }
    res.json({ message: 'Logout realizado com sucesso' });
  });
};

module.exports = { login, logout };
