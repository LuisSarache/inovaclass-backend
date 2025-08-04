const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();
const { InferenceClient } = require('@huggingface/inference');

const client = new InferenceClient(process.env.HF_TOKEN);

const iaRoutes = require('./routes/ia');
const chatRoutes = require('./routes/chat');
const questionRoutes = require('./routes/questions');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://inova-class-front-end.vercel.app",
  "https://inova-class-front-8xjrlzzm4-luissaraches-projects.vercel.app"
];

// Middleware CORS com tratamento de erro específico
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // permite curl/postman sem origin
    if(allowedOrigins.includes(origin)){
      return callback(null, origin);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

app.use(express.json());

// Rotas
app.use('/api/ia', iaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);

// Middleware para tratar erros de CORS separadamente
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    console.error('Erro CORS:', err.message);
    return res.status(403).json({ message: 'CORS error: origem não permitida' });
  }
  next(err);
});

// Middleware global de erro para capturar e exibir stack trace
app.use((err, req, res, next) => {
  console.error('Erro interno:', err);
  res.status(500).json({
    message: 'Erro interno no servidor',
    error: err.message,
    stack: err.stack, // útil para debug no dev
  });
});

sequelize.authenticate()
  .then(() => {
    console.log('Conectado ao banco SQL via Sequelize');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    console.log(`Tabelas sincronizadas com o banco`);
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => console.error('Erro ao conectar no banco:', err));
