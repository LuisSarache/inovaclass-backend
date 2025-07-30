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
  tipo: {
    type: DataTypes.ENUM('aluno', 'docente'),
    allowNull: false,
  }
}, {
  tableName: 'users',
  timestamps: false,
});

User.sync();

module.exports = {
  createUser: async (cpf, nome, tipo, callback) => {
    try {
      const user = await User.create({ cpf, nome, tipo });
      callback(null, user);
    } catch (error) {
      callback(error);
    }
  },

  findUserByCpf: async (cpf, callback) => {
    try {
      const user = await User.findOne({ where: { cpf } });
      callback(null, user ? [user] : []);
    } catch (error) {
      callback(error);
    }
  }
};
