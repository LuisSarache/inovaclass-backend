const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();
const session = require('express-session');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/users');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // seu frontend
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'uma-chave-secreta',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // true em produção com HTTPS
    maxAge: 1000 * 60 * 60 * 1,
  },
}));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

sequelize.authenticate()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    console.log('Conectado ao banco SQL via Sequelize');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => console.error('Erro ao conectar no banco:', err));

  
