const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cpf: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('aluno', 'docente'),
    allowNull: false,
  }
}, {
  tableName: 'users',
  timestamps: false,
});

// Sincroniza a tabela no banco (cuidado em produção)
User.sync();

// ✅ Função para encontrar usuário por CPF
const findUserByCpf = async (cpf, callback) => {
  try {
    const user = await User.findOne({ where: { cpf } });
    callback(null, user ? [user] : []);
  } catch (err) {
    callback(err);
  }
};

// ✅ Função para criar usuário
const createUser = async (userData, callback) => {
  try {
    const user = await User.create(userData);
    callback(null, user);
  } catch (err) {
    callback(err);
  }
};

module.exports = {
  findUserByCpf,
  createUser,
};
