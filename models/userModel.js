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

createUser: async (cpf, tipo, password, callback) => {
  try {
    const user = await User.create({ cpf, tipo, password });
    callback(null, user);
  } catch (error) {
    callback(error);
  }
},


});

User.sync();
