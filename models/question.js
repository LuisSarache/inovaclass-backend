const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // importa a instância correta

const Question = sequelize.define('Question', {
  pergunta: {
    type: DataTypes.STRING,
    allowNull: false
  },
  resposta: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'questions',
  timestamps: true
});

module.exports = Question;
