// models/Question.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  texto: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  respondida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, { timestamps: true });

module.exports = Question;
