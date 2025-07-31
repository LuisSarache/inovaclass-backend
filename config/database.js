const { Sequelize } = require('sequelize');
require('dotenv').config();
 
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // importante para conexões com SSL (Render exige isso)
    }
  },
  logging: false,
});
 
module.exports = sequelize; 