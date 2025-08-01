const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// Registrar usuário
const register = async (req, res) => {
  const { cpf, password, tipo, nome } = req.body;

  if (!cpf || !password || !tipo) {
    return res.status(400).json({ message: 'Preencha CPF, senha e tipo de usuário' });
  }

  try {
    const existingUser = await User.findOne({ where: { cpf } });
    if (existingUser) {
      return res.status(400).json({ message: 'CPF já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      cpf,
      password: hashedPassword,
      tipo,
      nome: nome || null
    });

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: newUser.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
  }
};

// Login do usuário
const login = async (req, res) => {
  const { cpf, password } = req.body;

  if (!cpf || !password) {
    return res.status(400).json({ message: 'Preencha CPF e senha' });
  }

  try {
    const user = await User.findOne({ where: { cpf } });
    if (!user) {
      return res.status(401).json({ message: 'CPF não encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    return res.status(200).json({ message: 'Login efetuado com sucesso!', userId: user.id, tipo: user.tipo });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

module.exports = {
  register,
  login,
};
