const express = require('express');
const cors = require('cors');
const session = require('express-session');
const sequelize = require('./config/database');
require('dotenv').config();

// Rotas
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();

app.use(cors());
app.use(express.json());

// Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'uma-chave-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true se usar HTTPS
}));

// Rotas
app.use('/api', authRoutes);
app.use('/api', chatRoutes);

// Conectar ao banco SQL
sequelize.authenticate()
  .then(() => {
    console.log('Conectado ao banco SQL via Sequelize');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
    });
  })
  .catch(err => console.error('Erro ao conectar no banco:', err));
