const express = require('express');
const db = require('./db');
const app = express();

app.use(express.json());

// Importa as rotas
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// Usa as rotas
app.use('/api/users', userRoutes);  // Exemplo: POST /api/users/register
app.use('/api/auth', authRoutes);   // Exemplo: POST /api/auth/login

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
    process.exit(1);
  } else {
    console.log('Conectado ao banco MySQL com sucesso!');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
    });
  }
});
