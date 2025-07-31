// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('inovaclass', 'root', 'secreto', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // remove logs no console (opcional)
});

module.exports = sequelize;
