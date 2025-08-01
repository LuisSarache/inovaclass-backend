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

// 🔄 Apenas retorna as Promises, sem usar callback
const createUser = ({ cpf, password, tipo }) => {
  return User.create({ cpf, password, tipo });
};

const findUserByCpf = (cpf) => {
  return User.findAll({ where: { cpf } });
};

module.exports = {
  User,
  createUser,
  findUserByCpf
};
