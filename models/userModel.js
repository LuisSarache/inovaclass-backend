const db = require('../db');

// Cria usuário com CPF e senha (hash)
const createUser = (cpf, passwordHash, callback) => {
  const sql = 'INSERT INTO users (cpf, password) VALUES (?, ?)';
  db.query(sql, [cpf, passwordHash], callback);
};

// Busca usuário pelo CPF
const findUserByCpf = (cpf, callback) => {
  const sql = 'SELECT * FROM users WHERE cpf = ?';
  db.query(sql, [cpf], callback);
};

module.exports = {
  createUser,
  findUserByCpf,
};
