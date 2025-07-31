const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();

// Rotas
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();

app.use(cors());
app.use(express.json());


// Rotas
app.use('/api', authRoutes);
app.use('/api', chatRoutes);

// Conectar ao banco SQL
sequelize.authenticate()
  .then(() => {
    const PORT = process.env.PORT || 5000;

    console.log('Conectado ao banco SQL via Sequelize');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('Erro ao conectar no banco:', err));
