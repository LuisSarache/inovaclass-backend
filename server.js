 const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();
const session = require('express-session');




// no backend (Node.js):
require('dotenv').config();
const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_TOKEN);

const iaRoutes = require("./routes/ia");
const chatRoutes = require('./routes/chat');
const questionRoutes = require('./routes/questions');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

const allowedOrigins = [
  "https://inova-class-front-end.vercel.app", // Antigo
  "https://inova-class-front-8xjrlzzm4-luissaraches-projects.vercel.app" ];// Novo domínio

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());
/*
app.use(session({
  secret: process.env.SESSION_SECRET || 'uma-chave-secreta',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // true em produção com HTTPS
    maxAge: 1000 * 60 * 60 * 1,
  },
}));
*/
app.use('/api/ia', iaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/questions', questionRoutes);

// Middleware para capturar erros e logar no console
app.use((err, req, res, next) => {
  console.error('Erro interno capturado:', err);
  res.status(500).json({ message: 'Erro interno no servidor', error: err.message });
});


sequelize.authenticate()
  .then(() => {
    console.log('Conectado ao banco SQL via Sequelize');

    // Cria as tabelas se não existirem
    return sequelize.sync({ alter: true }); // use { force: true } para recriar sempre (com cuidado)
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    console.log('Tabelas sincronizadas com o banco');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => console.error('Erro ao conectar no banco:', err));
  
