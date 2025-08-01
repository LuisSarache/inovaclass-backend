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
    allowNull: true,
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

// ⚠️ Adicionando as funções fora do define
const createUser = async ({ cpf, password, tipo }, callback) => {
  try {
    const user = await User.create({ cpf, password, tipo });
    callback(null, user);
  } catch (error) {
    callback(error);
  }
};

const findUserByCpf = async (cpf, callback) => {
  try {
    const users = await User.findAll({ where: { cpf } });
    callback(null, users);
  } catch (error) {
    callback(error);
  }
};

User.sync();

module.exports = {
  User,
  createUser,
  findUserByCpf
};
