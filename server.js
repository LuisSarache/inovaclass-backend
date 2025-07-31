const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();

const session = require('express-session');



// Rotas
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/users');
const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET || 'uma-chave-secreta',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // se estiver em produção com HTTPS, use true
    maxAge: 1000 * 60 * 60 * 1, // 1 hora
  },
}));



app.use(cors());
app.use(express.json());


// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
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
