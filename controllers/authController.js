const bcrypt = require('bcrypt');
const { createUser, findUserByCpf } = require('../models/userModel');

const register = async (req, res) => {
  const { cpf, password, tipo } = req.body;

  if (!cpf || !password || !tipo) {
    return res.status(400).json({ message: 'Preencha CPF, senha e tipo de usuário' });
  }

  try {
    const users = await findUserByCpf(cpf);

    if (users.length > 0) {
      return res.status(400).json({ message: 'Usuário já registrado com este CPF' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({ cpf, password: hashedPassword, tipo });

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ message: 'Erro ao registrar usuário', error: err.message });
  }
};

const login = async (req, res) => {
  const { cpf, password } = req.body;

  if (!cpf || !password) {
    return res.status(400).json({ message: 'Preencha CPF e senha' });
  }

  try {
    const users = await findUserByCpf(cpf);

    if (users.length === 0) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    // Aqui você pode gerar token ou sessão, se quiser
    res.status(200).json({ message: 'Login realizado com sucesso!', tipo: user.tipo });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: 'Erro no servidor', error: err.message });
  }
};

const logout = (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.status(200).json({ message: 'Logout realizado com sucesso!' });
    });
  } else {
    res.status(200).json({ message: 'Logout realizado com sucesso!' });
  }
};

module.exports = { register, login, logout };
