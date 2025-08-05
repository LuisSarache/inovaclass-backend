const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); 

module.exports = (sequelize, DataTypes) => {
  const Horario = sequelize.define("Horario", {
    diaSemana: DataTypes.STRING,
    horaInicio: DataTypes.STRING,
    horaFim: DataTypes.STRING
  });
  return Horario
  };