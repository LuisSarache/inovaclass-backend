const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  remetente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  destinatario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  data_envio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'chat_messages',
  timestamps: false,
});

ChatMessage.sync();

module.exports = { ChatMessage };
