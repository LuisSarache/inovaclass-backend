// models/userModel.js
const { DataTypes } = require('sequelize');
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
    type: DataTypes.ENUM('aluno', 'professor'),
    allowNull: false,
  }
}, {
  tableName: 'users',
  timestamps: false,
});

// Funções utilitárias
const createUser = async ({ cpf, password, tipo }) => {
  return await User.create({ cpf, password, tipo });
};

const findUserByCpf = async (cpf) => {
  return await User.findOne({ where: { cpf } });
};

module.exports = {
  User,
  createUser,
  findUserByCpf
};
